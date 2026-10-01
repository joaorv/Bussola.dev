-- CreateTable
CREATE TABLE "TermsAcceptance" (
    "id" SERIAL NOT NULL,
    "leadId" INTEGER NOT NULL,
    "termsVersion" TEXT NOT NULL,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TermsAcceptance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TermsAcceptance_leadId_acceptedAt_idx" ON "TermsAcceptance"("leadId", "acceptedAt");

-- CreateIndex
CREATE UNIQUE INDEX "TermsAcceptance_leadId_termsVersion_key" ON "TermsAcceptance"("leadId", "termsVersion");

-- AddForeignKey
ALTER TABLE "TermsAcceptance" ADD CONSTRAINT "TermsAcceptance_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

