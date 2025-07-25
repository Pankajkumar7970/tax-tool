import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import jsPDF from 'jspdf';

interface TaxData {
  income: number;
  deductions: {
    section80C: number;
    section80D: number;
    section80G: number;
    homeLoanInterest: number;
  };
  oldRegimeTax: number;
  newRegimeTax: number;
  recommendation: string;
  savings: number;
}

interface PDFReportGeneratorProps {
  taxData: TaxData;
}

export const PDFReportGenerator = ({ taxData }: PDFReportGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generatePDFReport = async () => {
    setIsGenerating(true);
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      pdf.setFont('helvetica', 'bold');
      // Header
      pdf.setFillColor(0, 112, 186); // Modern blue
      pdf.rect(0, 0, pageWidth, 30, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(22);
      pdf.text('Smart Tax Assistant Report', 20, 20);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth - 70, 20);
      // Section Divider
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.line(15, 32, pageWidth - 15, 32);
      // Income Summary
      let yPos = 50;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.setTextColor(0, 48, 135);
      pdf.text('Income Summary', 20, yPos);
      yPos += 12;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Annual Income:', 20, yPos);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`₹${taxData.income.toLocaleString()}`, pageWidth - 40, yPos, { align: 'right' });
      yPos += 10;
      pdf.setFont('helvetica', 'normal');
      // Deductions
      yPos += 10;
      pdf.setDrawColor(220, 220, 220);
      pdf.line(15, yPos, pageWidth - 15, yPos);
      yPos += 10;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.setTextColor(0, 48, 135);
      pdf.text('Deductions Claimed', 20, yPos);
      yPos += 12;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Section 80C:', 20, yPos);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`₹${taxData.deductions.section80C.toLocaleString()}`, pageWidth - 40, yPos, { align: 'right' });
      yPos += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.text('Section 80D:', 20, yPos);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`₹${taxData.deductions.section80D.toLocaleString()}`, pageWidth - 40, yPos, { align: 'right' });
      yPos += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.text('Section 80G:', 20, yPos);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`₹${taxData.deductions.section80G.toLocaleString()}`, pageWidth - 40, yPos, { align: 'right' });
      yPos += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.text('Home Loan Interest (24):', 20, yPos);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`₹${taxData.deductions.homeLoanInterest.toLocaleString()}`, pageWidth - 40, yPos, { align: 'right' });
      yPos += 12;
      pdf.setDrawColor(220, 220, 220);
      pdf.line(15, yPos, pageWidth - 15, yPos);
      // Tax Comparison
      yPos += 10;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.setTextColor(0, 48, 135);
      pdf.text('Tax Calculation Comparison', 20, yPos);
      yPos += 12;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Old Regime Tax:', 20, yPos);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`₹${taxData.oldRegimeTax.toLocaleString()}`, pageWidth - 40, yPos, { align: 'right' });
      yPos += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.text('New Regime Tax:', 20, yPos);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`₹${taxData.newRegimeTax.toLocaleString()}`, pageWidth - 40, yPos, { align: 'right' });
      yPos += 12;
      pdf.setDrawColor(220, 220, 220);
      pdf.line(15, yPos, pageWidth - 15, yPos);
      // Recommendation
      yPos += 10;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(0, 160, 230);
      pdf.text('Recommendation', 20, yPos);
      yPos += 10;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      const recommendationLines = pdf.splitTextToSize(taxData.recommendation, pageWidth - 40);
      pdf.text(recommendationLines, 20, yPos);
      yPos += recommendationLines.length * 6;
      // Savings
      yPos += 10;
      pdf.setFillColor(230, 255, 230);
      pdf.rect(15, yPos - 5, pageWidth - 30, 20, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(0, 120, 0);
      pdf.text(`Total Savings: ₹${Math.abs(taxData.savings).toLocaleString()}`, 20, yPos + 8);
      // Tax Saving Tips
      yPos += 35;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(15);
      pdf.setTextColor(0, 48, 135);
      pdf.text('Tax Saving Tips for Next Year', 20, yPos);
      yPos += 12;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      const tips = [
        '• Maximize 80C investments early in the financial year',
        '• Consider ELSS funds for dual benefit of tax saving and equity exposure',
        '• Plan health insurance premiums for Section 80D benefits',
        '• Keep proper documentation for all deductions claimed',
        '• Review and compare tax regimes annually based on your income structure'
      ];
      tips.forEach(tip => {
        pdf.text(tip, 20, yPos);
        yPos += 8;
      });
      // Footer
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text('Generated by Smart Tax Assistant - For informational purposes only', 20, pageHeight - 10);
      // Save the PDF
      pdf.save('tax-report.pdf');

      toast({
        title: "PDF Generated",
        description: "Your tax report has been downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Could not generate PDF report",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Tax Report Summary
            </h3>
            <p className="text-sm text-muted-foreground">Generate comprehensive PDF report</p>
          </div>
          {taxData.income > 0 && (
            <Button
              onClick={generatePDFReport}
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isGenerating ? "Generating..." : "Download PDF"}
            </Button>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-stretch text-center divide-y md:divide-y-0 md:divide-x divide-border border rounded-lg overflow-hidden">
          <div className="flex-1 py-4 px-2">
            <span className="text-sm text-muted-foreground">Annual Income</span>
            <p className="font-semibold">₹{taxData.income.toLocaleString()}</p>
          </div>
          <div className="flex-1 py-4 px-2">
            <span className="text-sm text-muted-foreground">Total Deductions</span>
            <p className="font-semibold">₹{Object.values(taxData.deductions).reduce((a, b) => a + b, 0).toLocaleString()}</p>
          </div>
          {taxData.income > 0 && (
            <>
              <div className="flex-1 py-4 px-2">
                <span className="text-sm text-muted-foreground">Recommended Regime</span>
                <p className="font-semibold">{taxData.recommendation}</p>
              </div>
              <div className="flex-1 py-4 px-2">
                <span className="text-sm text-muted-foreground">Tax Savings</span>
                <p className="font-semibold text-success">₹{Math.abs(taxData.savings).toLocaleString()}</p>
              </div>
            </>
          )}
        </div>

        <Separator />

        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Report will include:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-primary"></Badge>
              Complete income breakdown
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-primary"></Badge>
              Deduction analysis
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-primary"></Badge>
              Tax regime comparison
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-primary"></Badge>
              Personalized recommendations
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-primary"></Badge>
              Tax saving strategies
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="w-2 h-2 p-0 rounded-full bg-primary"></Badge>
              Next year planning tips
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};