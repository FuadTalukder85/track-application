import { JobApplicationFormData, JobType, WorkMode } from "@/types/job";

export interface ParsedJobData extends Partial<JobApplicationFormData> {
  rawHighlights?: {
    skillsDetected?: string[];
    confidence?: "high" | "medium" | "low";
  };
}

/**
 * Intelligent client-side parser to extract structured job application fields
 * from raw unstructured job descriptions, emails, or job postings.
 */
export function parseJobDescription(rawText: string): ParsedJobData {
  const text = rawText.trim();
  if (!text) return {};

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const result: ParsedJobData = {
    applicationStatus: "Applied",
    applicationDate: new Date().toISOString().split("T")[0],
    salaryCurrency: "USD",
  };

  // 1. Detect Job Posting URL
  const urlMatch = text.match(/https?:\/\/[^\s"'<>)\]]+/i);
  if (urlMatch) {
    result.jobPostingUrl = urlMatch[0];
  }

  // 2. Detect Currency
  if (/€|eur/i.test(text)) {
    result.salaryCurrency = "EUR";
  } else if (/£|gbp/i.test(text)) {
    result.salaryCurrency = "GBP";
  } else if (/bdt|৳/i.test(text)) {
    result.salaryCurrency = "BDT";
  } else if (/cad/i.test(text)) {
    result.salaryCurrency = "CAD";
  } else if (/aud/i.test(text)) {
    result.salaryCurrency = "AUD";
  } else if (/inr|₹/i.test(text)) {
    result.salaryCurrency = "INR";
  } else {
    result.salaryCurrency = "USD";
  }

  // 3. Detect Salary Range and Numbers
  // Patterns like: $120,000 - $150,000, $120k - $160k, 120,000 to 150,000 USD
  const salaryRangePattern =
    /(?:(?:salary|compensation|pay|rate|package)[:\s–-]*)?([$€£₹]?\s*\d{2,3}(?:[,\.]\d{3})*(?:\s*[kK])?\s*(?:-|–|to)\s*[$€£₹]?\s*\d{2,3}(?:[,\.]\d{3})*(?:\s*[kK])?(?:\s*(?:usd|eur|gbp|\/yr|\/year|\/mo|per year|annual))?)/i;
  const salaryMatch = text.match(salaryRangePattern);

  if (salaryMatch) {
    result.salaryRange = salaryMatch[1].trim();

    // Parse numbers for expectedSalary
    const numbers = result.salaryRange.match(/\d+(?:,\d+)?/g);
    if (numbers && numbers.length >= 2) {
      const parseVal = (str: string) => {
        let n = parseFloat(str.replace(/,/g, ""));
        if (result.salaryRange?.toLowerCase().includes("k") && n < 1000) {
          n = n * 1000;
        }
        return n;
      };
      const high = parseVal(numbers[1]);
      if (high > 1000) {
        result.expectedSalary = high;
      }
    }
  }

  // 4. Detect Job Type
  if (/\b(?:intern|internship)\b/i.test(text)) {
    result.jobType = "Internship";
  } else if (/\b(?:contract|contractor|c2c|w2\s*contract)\b/i.test(text)) {
    result.jobType = "Contract";
  } else if (/\b(?:part[\s-]time)\b/i.test(text)) {
    result.jobType = "Part-time";
  } else if (/\b(?:freelance|freelancer)\b/i.test(text)) {
    result.jobType = "Freelance";
  } else if (/\b(?:full[\s-]time)\b/i.test(text)) {
    result.jobType = "Full-time";
  } else {
    result.jobType = "Full-time";
  }

  // 5. Detect Work Mode
  if (/\b(?:remote|work from home|wfh|anywhere)\b/i.test(text)) {
    result.workMode = "Remote";
  } else if (/\b(?:hybrid)\b/i.test(text)) {
    result.workMode = "Hybrid";
  } else if (/\b(?:on[\s-]site|in[\s-]office|in[\s-]person)\b/i.test(text)) {
    result.workMode = "On-site";
  } else {
    result.workMode = "Remote";
  }

  // 6. Detect Location
  const locationLabelMatch = text.match(
    /(?:location|location\(s\)|office|based\s*in|workplace)[:\s–-]+([^\n\r,]+(?:,[^\n\r]+)?)/i
  );
  if (locationLabelMatch && locationLabelMatch[1].trim().length < 50) {
    result.jobLocation = locationLabelMatch[1].trim();
  } else {
    // Look for common patterns
    const commonLocMatch = text.match(
      /\b([A-Z][a-zA-Z\s]+,\s*[A-Z]{2}|New York|San Francisco|Los Angeles|Seattle|Austin|Boston|Chicago|London|Berlin|Toronto|Vancouver|Singapore|Dhaka|Bangalore|Remote)\b/i
    );
    if (commonLocMatch) {
      result.jobLocation = commonLocMatch[1].trim();
    }
  }

  // 7. Detect Company Name & Job Title
  // Check labeled fields first (e.g. "Company: Stripe", "Role: Senior Engineer")
  const companyLabelMatch = text.match(
    /(?:company(?:\s*name)?|organization|employer|hiring\s*company)[:\s–-]+([^\n\r]+)/i
  );
  if (companyLabelMatch) {
    result.companyName = companyLabelMatch[1].trim().replace(/[.,;]$/, "");
  }

  const roleLabelMatch = text.match(
    /(?:job\s*title|role|position|title|job\s*role)[:\s–-]+([^\n\r]+)/i
  );
  if (roleLabelMatch) {
    result.jobTitle = roleLabelMatch[1].trim().replace(/[.,;]$/, "");
  }

  // If company or title still not found, check "at Company" or "<Title> at <Company>" patterns
  if (!result.jobTitle || !result.companyName) {
    const titleAtCompanyMatch = text.match(
      /^([A-Z0-9][A-Za-z0-9/\-–—\s&]+?)\s+(?:at|@)\s+([A-Z0-9][A-Za-z0-9/\-–—\s&.,]+)/m
    );
    if (titleAtCompanyMatch) {
      if (!result.jobTitle) {
        result.jobTitle = titleAtCompanyMatch[1].trim();
      }
      if (!result.companyName) {
        result.companyName = titleAtCompanyMatch[2].trim().replace(/[.,;]$/, "");
      }
    }
  }

  // If company is still empty, look for "About <Company>" or domain from URL
  if (!result.companyName) {
    const aboutCompanyMatch = text.match(/about\s+([A-Z][a-zA-Z0-9&]+)(?:\s+is|\s*:|\s*\n)/i);
    if (aboutCompanyMatch) {
      result.companyName = aboutCompanyMatch[1].trim();
    } else if (result.jobPostingUrl) {
      try {
        const hostname = new URL(result.jobPostingUrl).hostname.replace(/^www\./, "");
        const namePart = hostname.split(".")[0];
        if (namePart && namePart.length > 2 && !["linkedin", "indeed", "glassdoor"].includes(namePart.toLowerCase())) {
          result.companyName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        }
      } catch {
        // Ignore URL parsing error
      }
    }
  }

  // If job title is still empty, scan top lines for typical software / design / product roles
  if (!result.jobTitle) {
    const roleKeywordsRegex =
      /\b(?:Senior|Lead|Junior|Staff|Principal|Associate)?\s*(?:Software|Frontend|Backend|Full\s*Stack|Web|Mobile|iOS|Android|DevOps|Cloud|Data|ML|AI|Product|QA|Test|UI\/UX|System)?\s*(?:Engineer|Developer|Architect|Designer|Manager|Specialist|Analyst|Consultant|Scientist)\b/i;

    for (const line of lines.slice(0, 10)) {
      if (line.length < 70 && roleKeywordsRegex.test(line)) {
        result.jobTitle = line.trim();
        break;
      }
    }
  }

  // If still missing title, fallback to line 1 if reasonable length
  if (!result.jobTitle && lines.length > 0 && lines[0].length < 60) {
    result.jobTitle = lines[0];
  }

  // 8. Extract Requirements Section
  const reqStartRegex =
    /(?:requirements|qualifications|what\s*(?:you'll|you)\s*bring|what\s*we're\s*looking\s*for|skills\s*(?:&|and)\s*experience|must\s*haves?)[:\s–-]*/i;
  const descStartRegex =
    /(?:about\s*the\s*(?:role|job|position)|responsibilities|what\s*you'll\s*do|job\s*description|overview)[:\s–-]*/i;

  const reqIndex = lines.findIndex((l) => reqStartRegex.test(l));
  const descIndex = lines.findIndex((l) => descStartRegex.test(l));

  if (reqIndex !== -1) {
    const reqLines: string[] = [];
    for (let i = reqIndex + 1; i < lines.length; i++) {
      const line = lines[i];
      // Stop if next major section is encountered
      if (/^[A-Z\s]{4,}:?$/.test(line) || descStartRegex.test(line) || /(?:benefits|perks|about\s*us)[:\s–-]*/i.test(line)) {
        break;
      }
      reqLines.push(line);
      if (reqLines.length >= 15) break;
    }
    if (reqLines.length > 0) {
      result.jobRequirements = reqLines.join("\n").trim();
    }
  }

  // 9. Extract Description Section
  if (descIndex !== -1) {
    const descLines: string[] = [];
    for (let i = descIndex + 1; i < lines.length; i++) {
      const line = lines[i];
      if (/^[A-Z\s]{4,}:?$/.test(line) || reqStartRegex.test(line) || /(?:benefits|perks|about\s*us)[:\s–-]*/i.test(line)) {
        break;
      }
      descLines.push(line);
      if (descLines.length >= 15) break;
    }
    if (descLines.length > 0) {
      result.jobDescription = descLines.join("\n").trim();
    }
  }

  // If description is still empty, summarize top lines
  if (!result.jobDescription) {
    result.jobDescription = lines.slice(0, 8).join("\n").slice(0, 500);
  }

  // If requirements empty and bullets exist in text, gather bullets
  if (!result.jobRequirements) {
    const bulletLines = lines.filter((l) => /^[-•*–]\s+/.test(l));
    if (bulletLines.length > 0) {
      result.jobRequirements = bulletLines.slice(0, 10).join("\n");
    }
  }

  // 10. Detect Tech Stack / Skills
  const commonTech = [
    "React",
    "Next.js",
    "Node.js",
    "TypeScript",
    "JavaScript",
    "Python",
    "Tailwind",
    "GraphQL",
    "REST",
    "PostgreSQL",
    "MongoDB",
    "Docker",
    "AWS",
    "Kubernetes",
    "Java",
    "Golang",
    "Vue",
    "Angular",
    "Figma",
  ];
  const detectedSkills = commonTech.filter((skill) =>
    new RegExp(`\\b${skill.replace(".", "\\.")}\\b`, "i").test(text)
  );

  result.rawHighlights = {
    skillsDetected: detectedSkills,
    confidence: result.companyName && result.jobTitle ? "high" : "medium",
  };

  return result;
}
