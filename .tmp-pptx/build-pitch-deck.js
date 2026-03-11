const fs = require("fs");
const path = require("path");
const PptxGenJS = require("./node_modules/pptxgenjs");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "OpenAI Codex";
pptx.company = "UT Bike Passport";
pptx.subject = "UT Bike Passport Hackathon Pitch";
pptx.title = "UT Bike Passport";
pptx.lang = "en-US";
pptx.theme = {
  headFontFace: "Georgia",
  bodyFontFace: "Aptos",
  lang: "en-US",
};

const C = {
  burnt: "BF5700",
  burntDeep: "8F3E00",
  cream: "F6EFE7",
  paper: "FFFAF4",
  ink: "2F2118",
  muted: "69584A",
  line: "D9C7B7",
  dark: "24170F",
  dark2: "312117",
  white: "FFFFFF",
};

function setBg(slide, color) {
  slide.background = { color };
}

function addTitle(slide, kicker, title, subtitle, opts = {}) {
  const dark = Boolean(opts.dark);
  const kickerColor = dark ? "F0D9C7" : C.burntDeep;
  const titleColor = dark ? C.white : C.ink;
  const subColor = dark ? "F7E6D7" : C.muted;

  slide.addText(kicker.toUpperCase(), {
    x: 0.72,
    y: 0.52,
    w: 6.2,
    h: 0.22,
    fontFace: "Aptos",
    fontSize: 10,
    bold: true,
    color: kickerColor,
    charSpace: 2.2,
    margin: 0,
  });

  slide.addText(title, {
    x: 0.72,
    y: 0.88,
    w: 11.4,
    h: 0.95,
    fontFace: "Georgia",
    fontSize: opts.titleSize || 28,
    bold: true,
    color: titleColor,
    margin: 0,
    fit: "shrink",
  });

  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.72,
      y: opts.subtitleY || 1.84,
      w: 10.4,
      h: 0.42,
      fontFace: "Aptos",
      fontSize: 12,
      color: subColor,
      margin: 0,
      fit: "shrink",
    });
  }
}

function addCard(slide, cfg) {
  const dark = Boolean(cfg.dark);
  const fillColor = cfg.fillColor || (dark ? C.white : C.paper);
  const fillTransparency = cfg.fillTransparency == null ? (dark ? 90 : 0) : cfg.fillTransparency;
  const lineColor = cfg.lineColor || (dark ? C.white : C.line);
  const lineTransparency = cfg.lineTransparency == null ? (dark ? 55 : 0) : cfg.lineTransparency;
  const labelColor = dark ? "F2D6C1" : C.burntDeep;
  const titleColor = dark ? C.white : C.ink;
  const bodyColor = dark ? "F9EBDD" : C.muted;

  slide.addShape(pptx.ShapeType.roundRect, {
    x: cfg.x,
    y: cfg.y,
    w: cfg.w,
    h: cfg.h,
    rectRadius: 0.08,
    line: { color: lineColor, transparency: lineTransparency, pt: 1 },
    fill: { color: fillColor, transparency: fillTransparency },
  });

  if (cfg.label) {
    slide.addText(cfg.label.toUpperCase(), {
      x: cfg.x + 0.18,
      y: cfg.y + 0.16,
      w: cfg.w - 0.36,
      h: 0.18,
      fontFace: "Aptos",
      fontSize: 8,
      bold: true,
      color: labelColor,
      charSpace: 1.8,
      margin: 0,
      fit: "shrink",
    });
  }

  slide.addText(cfg.title, {
    x: cfg.x + 0.18,
    y: cfg.y + (cfg.label ? 0.42 : 0.2),
    w: cfg.w - 0.36,
    h: cfg.titleH || 0.34,
    fontFace: "Georgia",
    fontSize: cfg.titleSize || 16,
    bold: true,
    color: titleColor,
    margin: 0,
    fit: "shrink",
  });

  if (cfg.body) {
    slide.addText(cfg.body, {
      x: cfg.x + 0.18,
      y: cfg.y + (cfg.bodyY || (cfg.label ? 0.86 : 0.6)),
      w: cfg.w - 0.36,
      h: cfg.bodyH || (cfg.h - (cfg.label ? 1.02 : 0.74)),
      fontFace: "Aptos",
      fontSize: cfg.bodySize || 11,
      color: bodyColor,
      margin: 0,
      valign: "top",
      fit: "shrink",
      breakLine: false,
    });
  }
}

function addPill(slide, text, x, y, w, dark) {
  slide.addText(text.toUpperCase(), {
    x,
    y,
    w,
    h: 0.3,
    fontFace: "Aptos",
    fontSize: 8,
    bold: true,
    color: dark ? C.white : C.burntDeep,
    align: "center",
    valign: "mid",
    margin: 0,
    fill: { color: dark ? C.white : C.burnt, transparency: dark ? 88 : 92 },
    line: { color: dark ? C.white : C.burnt, transparency: dark ? 65 : 82, pt: 1 },
  });
}

function addCallout(slide, title, body, opts = {}) {
  const dark = Boolean(opts.dark);
  addCard(slide, {
    x: opts.x,
    y: opts.y,
    w: opts.w,
    h: opts.h,
    dark,
    fillTransparency: dark ? 88 : 92,
    lineTransparency: dark ? 58 : 70,
    title,
    body,
    titleSize: opts.titleSize || 18,
    bodySize: opts.bodySize || 11,
    bodyY: opts.bodyY || 0.62,
    bodyH: opts.bodyH || 0.4,
  });
}

// Slide 1
{
  const slide = pptx.addSlide();
  setBg(slide, C.burnt);
  addTitle(
    slide,
    "Build it Forward | UT Austin mobility",
    "UT Bike Passport",
    "The student workflow for bike ownership, theft reporting, and recovery.",
    { dark: true, titleSize: 30 }
  );
  addPill(slide, "Register", 0.74, 2.55, 1.2, true);
  addPill(slide, "Report", 2.06, 2.55, 1.15, true);
  addPill(slide, "Recover", 3.33, 2.55, 1.22, true);
  addCallout(
    slide,
    "From fragmented pages to one recovery path.",
    "Students do not just lose bikes to theft. They lose recovery because the workflow is disconnected.",
    { x: 0.74, y: 5.25, w: 8.2, h: 1.1, dark: true, titleSize: 21, bodyY: 0.64 }
  );
}

// Slide 2
{
  const slide = pptx.addSlide();
  setBg(slide, C.cream);
  addTitle(
    slide,
    "Problem",
    "The system breaks at the handoff points.",
    "Students deal with separate pages for ownership, theft reporting, and recovery. That delay is what kills recovery.",
    { titleSize: 25 }
  );
  addCard(slide, {
    x: 0.74, y: 2.35, w: 3.85, h: 2.0,
    label: "Before theft",
    title: "No record",
    body: "Serial, photos, and proof are scattered or missing.",
    titleSize: 19, bodyY: 0.9
  });
  addCard(slide, {
    x: 4.74, y: 2.35, w: 3.85, h: 2.0,
    label: "During theft",
    title: "Too slow",
    body: "Students rebuild details when speed matters most.",
    titleSize: 19, bodyY: 0.9
  });
  addCard(slide, {
    x: 8.74, y: 2.35, w: 3.85, h: 2.0,
    label: "After recovery",
    title: "No match",
    body: "Recovered bikes can still go unclaimed without a clean owner path.",
    titleSize: 19, bodyY: 0.9
  });
  addCallout(
    slide,
    "Multiple UT pages. No end-to-end integration.",
    "That is why recovered bikes can still miss their owner and fall out of the student recovery loop.",
    { x: 0.74, y: 5.55, w: 8.9, h: 1.0, titleSize: 18 }
  );
}

// Slide 3
{
  const slide = pptx.addSlide();
  setBg(slide, C.dark2);
  addTitle(
    slide,
    "Why this matters",
    "UT does not need another page. It needs one student-facing workflow.",
    "The goal is not to replace UT systems. The goal is to connect them in a way students can actually use.",
    { dark: true, titleSize: 24 }
  );
  addCard(slide, {
    x: 0.74, y: 2.3, w: 5.75, h: 2.45,
    label: "Today",
    title: "Fragmented flow",
    body: "- Ownership proof lives in one place or nowhere.\n- Missing reports happen somewhere else.\n- Recovered bikes still need manual routing.",
    dark: true,
    bodyY: 0.88,
    bodyH: 1.2,
  });
  addCard(slide, {
    x: 6.84, y: 2.3, w: 5.75, h: 2.45,
    label: "UT Bike Passport",
    title: "Connected flow",
    body: "- Create a passport before theft.\n- Mark the bike missing in one tap.\n- Route found-bike leads back to the owner.",
    dark: true,
    bodyY: 0.88,
    bodyH: 1.2,
  });
  addPill(slide, "Better student experience", 0.78, 5.42, 2.35, true);
  addPill(slide, "Faster recovery loop", 3.26, 5.42, 2.05, true);
  addPill(slide, "Realistic adoption path", 5.44, 5.42, 2.35, true);
}

// Slide 4
{
  const slide = pptx.addSlide();
  setBg(slide, C.cream);
  addTitle(
    slide,
    "Solution",
    "One place to register, report, and recover.",
    "The wedge is intentionally narrow: ownership first, recovery second, campus visibility as leverage.",
    { titleSize: 25 }
  );
  addCard(slide, {
    x: 0.72, y: 2.3, w: 3.85, h: 2.35,
    label: "01 | Register",
    title: "Bike passport",
    body: "Serial, make, model, photos, lock setup, and parking habits.",
    titleSize: 17,
    bodyY: 0.86
  });
  addCard(slide, {
    x: 4.74, y: 2.3, w: 3.85, h: 2.35,
    label: "02 | Report",
    title: "Missing mode",
    body: "Mark the bike missing and place it on the campus board.",
    titleSize: 17,
    bodyY: 0.86
  });
  addCard(slide, {
    x: 8.76, y: 2.3, w: 3.85, h: 2.35,
    label: "03 | Recover",
    title: "Found-bike desk",
    body: "Helpers submit leads and the likely owner gets alerted.",
    titleSize: 17,
    bodyY: 0.86
  });
  addCallout(
    slide,
    "This is the wedge.",
    "Start with the workflow students need now. Expand into campus partners later.",
    { x: 0.72, y: 5.55, w: 8.35, h: 1.0, titleSize: 19 }
  );
}

// Slide 5
{
  const slide = pptx.addSlide();
  setBg(slide, C.cream);
  addTitle(
    slide,
    "What we built",
    "The web MVP already closes the loop.",
    "A rider creates a passport, marks the bike missing, a helper submits a found lead, and the owner sees a match alert.",
    { titleSize: 25 }
  );
  const cards = [
    ["01", "Passport", "Verified ownership record before theft."],
    ["02", "Missing board", "Public visibility for active missing bikes."],
    ["03", "Found desk", "Lead intake for campus helpers and staff."],
    ["04", "Alerts", "Match notifications with follow-up details."],
  ];
  cards.forEach((item, idx) => {
    addCard(slide, {
      x: 0.6 + idx * 3.15,
      y: 2.35,
      w: 2.95,
      h: 2.1,
      label: item[0],
      title: item[1],
      body: item[2],
      titleSize: 16,
      bodyY: 0.86,
      bodyH: 0.72,
    });
  });
  addCallout(
    slide,
    "The missing board does two jobs.",
    "It shows likely theft hotspots and creates pressure for campus response instead of letting incidents stay invisible.",
    { x: 0.72, y: 5.55, w: 9.2, h: 1.0, titleSize: 18 }
  );
}

// Slide 6
{
  const slide = pptx.addSlide();
  setBg(slide, C.burnt);
  addTitle(
    slide,
    "Impact",
    "Strong enough to outlast the hackathon.",
    "This helps students immediately and becomes more valuable as UT partners plug into the same workflow.",
    { dark: true, titleSize: 26 }
  );
  addCard(slide, {
    x: 0.72, y: 2.35, w: 3.88, h: 2.2,
    label: "For students",
    title: "Peace of mind",
    body: "Ownership proof exists before a theft happens.",
    dark: true,
    titleSize: 17,
    bodyY: 0.86
  });
  addCard(slide, {
    x: 4.74, y: 2.35, w: 3.88, h: 2.2,
    label: "For recovery",
    title: "Less goes unclaimed",
    body: "Found-bike leads are routed back to the likely owner faster.",
    dark: true,
    titleSize: 17,
    bodyY: 0.86
  });
  addCard(slide, {
    x: 8.76, y: 2.35, w: 3.88, h: 2.2,
    label: "For campus",
    title: "Better pressure",
    body: "Visible missing-bike activity highlights hotspots and gaps in response.",
    dark: true,
    titleSize: 17,
    bodyY: 0.86
  });
  addCallout(
    slide,
    "Best framing: a student-friendly workflow layer around existing UT systems.",
    "That makes adoption realistic and fits the Build it Forward theme better than pitching a full replacement system.",
    { x: 0.72, y: 5.55, w: 10.3, h: 1.0, dark: true, titleSize: 18 }
  );
}

// Slide 7
{
  const slide = pptx.addSlide();
  setBg(slide, C.cream);
  addTitle(
    slide,
    "Tech stack",
    "Built fast, but with a real product architecture.",
    "The stack is simple enough for an MVP and strong enough to grow into a campus-ready system.",
    { titleSize: 24 }
  );
  const stackCards = [
    ["Frontend", "Next.js App Router", "React 19\nTypeScript\nTailwind CSS v4"],
    ["Map and UX", "Campus visibility", "Leaflet\nOpenStreetMap tiles\nMobile-friendly responsive UI"],
    ["Backend logic", "Recovery workflow", "Server Actions\nRoute handlers\nCookie-based session auth"],
    ["Data model", "MVP storage today", "CSV-backed local store\nBikes, users, found posts, notifications\nPrisma plus SQLite path ready next"],
    ["Matching", "How alerts work", "Exact serial match\nMake, model, color overlap\nKeyword similarity"],
    ["Built with Codex", "End-to-end acceleration", "Repo exploration and debugging\nUI refactor and flow fixes\nPitch deck and demo prep"],
  ];
  stackCards.forEach((item, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    addCard(slide, {
      x: col === 0 ? 0.72 : 6.68,
      y: 2.18 + row * 1.47,
      w: 5.92,
      h: 1.22,
      label: item[0],
      title: item[1],
      body: item[2],
      titleSize: 15,
      bodySize: 9.5,
      bodyY: 0.48,
      bodyH: 0.58,
    });
  });
}

// Slide 8
{
  const slide = pptx.addSlide();
  setBg(slide, C.dark2);
  addTitle(
    slide,
    "Data flow and roadmap",
    "Working loop now. Strong AI roadmap next.",
    "The MVP already connects register to recovery. The next step is image comparison when photos are available.",
    { dark: true, titleSize: 24 }
  );
  const flow = [
    ["01", "Create passport", "Ownership record is saved before theft."],
    ["02", "Mark missing", "Bike appears on the public board."],
    ["03", "Submit found lead", "Campus helper enters details at the desk."],
    ["04", "Notify owner", "System explains why the match looks likely."],
  ];
  flow.forEach((item, idx) => {
    addCard(slide, {
      x: 0.58 + idx * 3.17,
      y: 2.38,
      w: 2.97,
      h: 2.08,
      label: item[0],
      title: item[1],
      body: item[2],
      dark: true,
      titleSize: 15,
      bodySize: 10,
      bodyY: 0.84,
      bodyH: 0.72,
    });
  });
  addCallout(
    slide,
    "Next: OpenAI image comparison.",
    "Compare passport photos to found-bike photos to raise confidence and reduce false positives.",
    { x: 0.72, y: 5.52, w: 9.35, h: 1.0, dark: true, titleSize: 18 }
  );
}

const outputDir = path.resolve(__dirname, "../web/artifacts");
fs.mkdirSync(outputDir, { recursive: true });
const outputPath = path.join(outputDir, "UT-Bike-Passport-Pitch.pptx");

pptx.writeFile({ fileName: outputPath })
  .then(() => {
    console.log(outputPath);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });