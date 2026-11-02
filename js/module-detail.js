document.addEventListener("DOMContentLoaded", () => {
  /* ================= MODULE DATA & HEADING LOGIC ================= */
  const moduleTitleEl = document.getElementById("moduleTitle");
  const downloadPdfLink = document.querySelector(".download-pdf");
  const params = new URLSearchParams(window.location.search);
  const moduleId = params.get("module") || "1";

  const moduleData = {
    "1": {
      title: "AURA Foundations",
      pdf: "assets/pdfs/aura-foundations.pdf",
      topics: [
        {
          id: "topic1",
          label: "Chapter 1: Understanding AURA",
          title: "Understanding AURA",
          content: `
            <p>AURA is a fintech-enabled business ecosystem designed to convert user actions into long-term economic value. The platform connects users, brands, partners, and collaborators through a unified growth model.</p>
            <p>This section explains the vision, purpose, and philosophy behind AURA, including how learning, engagement, and participation translate into measurable outcomes.</p>
          `
        },
        {
          id: "topic2",
          label: "Chapter 2: Platform Architecture",
          title: "Platform Architecture",
          content: `
            <p>The AURA platform is built on a modular architecture consisting of a rewards engine, collaboration layer, analytics framework, and opportunity marketplace.</p>
            <p>This architecture ensures scalability, transparency, and flexibility, allowing users and businesses to grow together efficiently.</p>
          `
        },
        {
          id: "topic3",
          label: "Chapter 3: Value Creation Model",
          title: "Value Creation Model",
          content: `
            <p>Every action on AURA contributes to long-term value creation. Instead of short-term incentives, rewards accumulate and unlock meaningful opportunities such as partnerships, investments, and ownership.</p>
            <p>This model encourages consistency, learning, and collaboration, enabling users to build sustainable digital and financial assets.</p>
          `
        }
      ]
    },
    "2": {
      title: "Rewards to Long-Term Value",
      pdf: "assets/pdfs/rewards-to-value.pdf",
      topics: [
        {
          id: "topic1",
          label: "Chapter 1: Reward Tokenomics",
          title: "Reward Tokenomics & Economics",
          content: `
            <p>Discover how AURA points tie directly into company equity and valuation. Every 100 points earned across partner stores translates into cryptographic stake and tangible redemption value.</p>
            <p>Learn the economic backing ratios, circulating coin parameters, and real-time value formulas that power the ecosystem.</p>
          `
        },
        {
          id: "topic2",
          label: "Chapter 2: Compounding Rewards",
          title: "Compounding & Future Value",
          content: `
            <p>Unlike traditional loyalty schemes that expire, AURA rewards appreciate alongside platform network growth and commercial franchise revenues.</p>
            <p>We break down historical performance models, staking multipliers, and redemption avenues through commercial property stakes.</p>
          `
        },
        {
          id: "topic3",
          label: "Chapter 3: Conversion & Liquidity",
          title: "Conversion, Staking & Cashout",
          content: `
            <p>Step-by-step guidance on converting points into partner vouchers, merchant credit, or holding them in tokenized format for long-term dividends.</p>
            <p>Explore partner merchant integration points and how QR-based point accumulation works in retail stores.</p>
          `
        }
      ]
    },
    "3": {
      title: "Opportunities & Collaboration",
      pdf: "assets/pdfs/opportunities-collaboration.pdf",
      topics: [
        {
          id: "topic1",
          label: "Chapter 1: Franchise Fundamentals",
          title: "Navigating Franchise Opportunities",
          content: `
            <p>Evaluating commercial franchise opportunities across fitness (FitZone), food & beverage (Urban Brew Café), and cloud kitchens.</p>
            <p>Understand Capex, Opex, royalty structures, and verified return on investment projections for early-stage entrepreneurs.</p>
          `
        },
        {
          id: "topic2",
          label: "Chapter 2: Strategic Partnerships",
          title: "Structuring Co-Venture Collaborations",
          content: `
            <p>How to pitch co-working spaces, cloud kitchen sharing, and multi-brand retail spots. Learn legal frameworks, MoU templates, and equity-sharing conventions.</p>
            <p>Understand the 'PARTNER' verification badge and incubated company benefits on AURA.</p>
          `
        },
        {
          id: "topic3",
          label: "Chapter 3: Pitching & Capital",
          title: "Raising Expansion Capital",
          content: `
            <p>Prepare pitch collateral, financial audits, and property requirements to secure franchise licenses and strategic co-investors on AURA.</p>
            <p>Connect with vetted investors and operational partners looking to back proven concepts.</p>
          `
        }
      ]
    }
  };

  const currentModule = moduleData[moduleId] || moduleData["1"];

  if (moduleTitleEl) {
    moduleTitleEl.textContent = currentModule.title;
  }

  if (downloadPdfLink) {
    downloadPdfLink.href = currentModule.pdf;
    downloadPdfLink.setAttribute("download", currentModule.pdf.split("/").pop());
  }

  /* ================= RENDER TOPICS ================= */
  const topicListEl = document.querySelector(".module-topic-list");
  const contentSectionEl = document.querySelector(".module-content");

  if (topicListEl && contentSectionEl && currentModule.topics) {
    topicListEl.innerHTML = "";
    contentSectionEl.innerHTML = "";

    currentModule.topics.forEach((t, index) => {
      // Sidebar list item
      const li = document.createElement("li");
      li.dataset.topic = t.id;
      li.textContent = t.label;
      if (index === 0) li.classList.add("active");
      topicListEl.appendChild(li);

      // Content item
      const div = document.createElement("div");
      div.className = `topic-content ${index === 0 ? "active" : ""}`;
      div.id = t.id;
      div.style.display = index === 0 ? "block" : "none";
      div.innerHTML = `<h1>${t.title}</h1>${t.content}`;
      contentSectionEl.appendChild(div);
    });

    // Attach topic click listeners
    const topicLinks = topicListEl.querySelectorAll("li");
    const topicContents = contentSectionEl.querySelectorAll(".topic-content");

    topicLinks.forEach(link => {
      link.addEventListener("click", () => {
        const topicId = link.dataset.topic;

        topicContents.forEach(content => {
          content.classList.remove("active");
          content.style.display = "none";
        });

        topicLinks.forEach(l => l.classList.remove("active"));

        const activeContent = document.getElementById(topicId);
        if (activeContent) {
          activeContent.classList.add("active");
          activeContent.style.display = "block";
        }
        link.classList.add("active");
      });
    });
  }
});
