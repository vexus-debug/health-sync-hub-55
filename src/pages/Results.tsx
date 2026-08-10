import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail, MessageCircle, FileDown, ShieldCheck, Loader2, Search, Printer } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { buildWhatsAppLink } from "@/lib/site";
import { SEO } from "@/components/seo/SEO";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ReportPreview } from "@/components/dashboard/ReportPreview";
import { TestForm } from "@/lib/labCatalog";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface PublicResult {
  serial: string;
  patient_name: string;
  age: number;
  gender: string;
  date_collected: string;
  completed_at: string | null;
  nature_of_specimen: string | null;
  examination_required: string | null;
  tests_requested: string[];
  referred_by: string | null;
  results: Record<string, string> | null;
  status: string;
  scientist_name: string | null;
}

const waitForNextPaint = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

const waitForReportImages = async (root: HTMLElement) => {
  const images = Array.from(root.querySelectorAll("img"));
  await Promise.all(
    images.map(
      (image) =>
        image.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              image.onload = () => resolve();
              image.onerror = () => resolve();
            })
    )
  );
};

const getReportElement = (root: HTMLElement) => root.querySelector<HTMLElement>(".print-report") ?? root;

const Results = () => {
  const [serial, setSerial] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PublicResult | null>(null);
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to report when result loads
  useEffect(() => {
    if (result && reportRef.current) {
      setTimeout(() => {
        reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [result]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ref = serial.trim().toUpperCase();
    if (!ref) return;
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await (supabase as any).rpc("get_public_result", { _serial: ref });
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      if (!row) {
        toast({
          title: "No completed result found",
          description: "Check your reference ID. Results are only available once your test is marked Completed.",
          variant: "destructive",
        });
        return;
      }
      setResult(row as PublicResult);
    } catch (err: any) {
      toast({ title: "Lookup failed", description: err.message ?? "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
    if (!reportRef.current) return;

    const target = getReportElement(reportRef.current);
    await waitForReportImages(target);

    const frame = document.createElement("iframe");
    frame.title = "Print result";
    frame.setAttribute("aria-hidden", "true");
    Object.assign(frame.style, {
      border: "0",
      height: "0",
      position: "fixed",
      right: "0",
      bottom: "0",
      width: "0",
    });

    document.body.appendChild(frame);
    const frameDoc = frame.contentDocument;
    if (!frameDoc) {
      frame.remove();
      window.print();
      return;
    }

    const styles = Array.from(document.querySelectorAll<HTMLLinkElement | HTMLStyleElement>('link[rel="stylesheet"], style'))
      .map((node) => node.outerHTML)
      .join("\n");

    frameDoc.open();
    frameDoc.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    ${styles}
  </head>
  <body class="print-frame-body">
    <main class="print-document">${target.outerHTML}</main>
  </body>
</html>`);
    frameDoc.close();

    const printFrame = async () => {
      const frameReport = frameDoc.querySelector<HTMLElement>(".print-report");
      if (frameReport) await waitForReportImages(frameReport);
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
      setTimeout(() => frame.remove(), 1000);
    };

    if (frame.contentDocument?.readyState === "complete") {
      await printFrame();
    } else {
      frame.onload = () => void printFrame();
    }
  };

  const handleDownload = async () => {
    if (!reportRef.current || !result) return;
    setDownloading(true);

    let captureHost: HTMLDivElement | null = null;
    try {
      const A4_W = 210;
      const A4_H = 297;
      const MARGIN = 10;
      const CONTENT_W = A4_W - MARGIN * 2;
      const PAGE_CONTENT_H = A4_H - MARGIN * 2;
      const CAPTURE_WIDTH_PX = 794;

      const target = getReportElement(reportRef.current);
      const clone = target.cloneNode(true) as HTMLElement;
      clone.style.width = `${CAPTURE_WIDTH_PX}px`;
      clone.style.maxWidth = `${CAPTURE_WIDTH_PX}px`;
      clone.style.margin = "0";
      clone.style.borderRadius = "0";
      clone.style.boxShadow = "none";
      clone.style.overflow = "visible";

      captureHost = document.createElement("div");
      Object.assign(captureHost.style, {
        background: "#ffffff",
        left: "-10000px",
        position: "fixed",
        top: "0",
        width: `${CAPTURE_WIDTH_PX}px`,
        zIndex: "2147483647",
      });
      captureHost.appendChild(clone);
      document.body.appendChild(captureHost);

      await waitForReportImages(clone);
      await document.fonts?.ready;
      await waitForNextPaint();

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
        width: clone.scrollWidth,
        height: clone.scrollHeight,
        windowWidth: CAPTURE_WIDTH_PX,
        windowHeight: clone.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        onclone: (_documentClone, element) => {
          const clonedReport = element as HTMLElement;
          clonedReport.style.background = "#ffffff";
          clonedReport.style.color = "#0f172a";
          clonedReport.style.opacity = "1";
          clonedReport.style.visibility = "visible";
        },
      });

      if (!canvas.width || !canvas.height) {
        throw new Error("Could not render report");
      }

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pxPerMm = canvas.width / CONTENT_W;
      const pageHeightPx = Math.floor(PAGE_CONTENT_H * pxPerMm);
      let offsetPx = 0;
      let pageIndex = 0;

      while (offsetPx < canvas.height) {
        const sliceHeightPx = Math.min(pageHeightPx, canvas.height - offsetPx);
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeightPx;

        const context = pageCanvas.getContext("2d");
        if (!context) throw new Error("Could not prepare PDF page");

        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        context.drawImage(canvas, 0, offsetPx, canvas.width, sliceHeightPx, 0, 0, canvas.width, sliceHeightPx);

        if (pageIndex > 0) pdf.addPage();
        pdf.addImage(pageCanvas.toDataURL("image/png"), "PNG", MARGIN, MARGIN, CONTENT_W, sliceHeightPx / pxPerMm);

        offsetPx += sliceHeightPx;
        pageIndex += 1;
      }

      pdf.save(`Medvic-Result-${result.serial}.pdf`);
    } catch (err: any) {
      toast({ title: "Download failed", description: err.message ?? "Try again.", variant: "destructive" });
    } finally {
      captureHost?.remove();
      setDownloading(false);
    }
  };

  // Build a TestForm-shaped object so we can reuse ReportPreview
  const reportForm: TestForm | null = result
    ? {
        serial: result.serial,
        patientName: result.patient_name,
        age: result.age,
        gender: (result.gender as "Male" | "Female") ?? "Male",
        phone: "",
        referredBy: result.referred_by ?? "—",
        dateCollected: result.date_collected,
        natureOfSpecimen: result.nature_of_specimen ?? "—",
        examinationRequired: result.examination_required ?? result.tests_requested.join(", "),
        testsRequested: result.tests_requested,
        bill: "Patient",
        status: "Completed",
        results: result.results ?? {},
        completedAt: result.completed_at ?? undefined,
      }
    : null;

  return (
    <Layout>
      <SEO
        title="Download Test Results | Medvic Goodhealth Lab"
        description="Securely access your Medvic Goodhealth lab results using only your reference ID. View and download your confidential report instantly."
        keywords="download lab results Port Harcourt, medical test results Nigeria, Medvic Goodhealth results"
      />

      {/* Print: hide everything except the report */}
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 10mm; }
          html, body, #root { background: #fff !important; height: auto !important; margin: 0 !important; overflow: visible !important; padding: 0 !important; }
          body * { visibility: hidden !important; }
          .print-area, .print-area *, .print-document, .print-document * { visibility: visible !important; }
          .print-area, .print-document { background: #fff !important; display: block !important; height: auto !important; margin: 0 !important; overflow: visible !important; padding: 0 !important; position: static !important; width: 100% !important; }
          .print-report { background: #fff !important; border: 0 !important; border-radius: 0 !important; box-shadow: none !important; color: #0f172a !important; display: block !important; height: auto !important; margin: 0 auto !important; max-width: 190mm !important; overflow: visible !important; page-break-inside: auto !important; width: 100% !important; }
          .print-report section, .print-report table, .print-report tr, .print-report img { break-inside: avoid; page-break-inside: avoid; }
          .no-print { display: none !important; }
          .print-frame-body * { visibility: visible !important; }
        }
      `}</style>

      <div className="no-print">
        <PageHeader
          eyebrow="Download Results"
          title="Access your test results — privately."
          subtitle="Enter the reference ID printed on your booking slip to view and download your report."
        />
      </div>

      <section className="py-16 no-print">
        <div className="container grid lg:grid-cols-2 gap-10">
          <form onSubmit={onSubmit} className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-soft space-y-5 h-fit">
            <div className="flex items-center gap-3 text-primary mb-2">
              <Lock className="h-5 w-5" />
              <span className="font-semibold text-sm uppercase tracking-wider">Secure Lookup</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ref">Reference / Serial ID</Label>
              <Input
                id="ref"
                name="ref"
                placeholder="e.g. MV-2026-00001"
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
                maxLength={40}
                required
                autoComplete="off"
              />
              <p className="text-xs text-muted-foreground">This is the lab number printed on your slip.</p>
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {loading ? "Searching..." : "Retrieve My Result"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Only completed results are released. If yours is still processing, please check back soon.
            </p>
          </form>

          <aside className="space-y-5">
            <div className="rounded-3xl bg-gradient-primary text-primary-foreground p-8 shadow-elegant">
              <ShieldCheck className="h-9 w-9 mb-3" />
              <h3 className="font-display font-bold text-2xl mb-2">Your results, your control.</h3>
              <p className="text-primary-foreground/85">Reports are released only with your reference ID. We never share your data with third parties.</p>
            </div>
            <div className="rounded-3xl bg-card border border-border p-7 space-y-4">
              <h3 className="font-display font-bold">Need help?</h3>
              <p className="text-sm text-muted-foreground">Lost your reference ID or need it sent another way?</p>
              <div className="flex flex-col gap-3">
                <Button asChild variant="soft">
                  <a href={buildWhatsAppLink("Hello Medvic, I'd like to retrieve my test result.")} target="_blank" rel="noreferrer">
                    <MessageCircle className="h-4 w-4" /> Request via WhatsApp
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="mailto:info@medvicgoodhealth.com?subject=Result%20Request">
                    <Mail className="h-4 w-4" /> Email Records Desk
                  </a>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {reportForm && (
        <section className="pb-16">
          <div className="container space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 no-print">
              <div>
                <h2 className="font-display font-bold text-2xl">Result for {reportForm.serial}</h2>
                <p className="text-sm text-muted-foreground">{reportForm.patientName} — {reportForm.age}y · {reportForm.gender}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="h-4 w-4" /> Print
                </Button>
                <Button variant="hero" onClick={handleDownload} disabled={downloading}>
                  {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
                  {downloading ? "Preparing..." : "Download PDF"}
                </Button>
              </div>
            </div>
            <div ref={reportRef} className="print-area">
              <ReportPreview form={reportForm} values={reportForm.results ?? {}} scientistName={result?.scientist_name ?? undefined} />
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default Results;
