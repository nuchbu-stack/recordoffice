const form = document.getElementById("surveyForm");
const q0 = document.getElementById("q0");
const q0Other = document.getElementById("q0Other");
const q1Options = document.querySelectorAll("#q1Options .option");
const q2Section = document.getElementById("q2Section");
const q2Other = document.getElementById("q2Other");
const thankYou = document.getElementById("thankYou");


// กำหนด URL ของ Google Forms และ Entry ID
// *** แก้ไขตรงนี้ ***
const FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLScRmNRVi7R8mrfmSq2fCykusMQ-D7g5fhkgka8wtuoDnEqh8A/formResponse";
const ENTRIES = {
  q0: "entry.309877389",
  q1: "entry.130860608",
  q2: "entry.656970769",
  q3: "entry.727335010"
};


let q0Value = "";
let q1Value = "";
let q2Value = "";

// แสดง/ซ่อน input อื่นๆ ของ Q0
q0.addEventListener("change", () => {
  if (q0.value === "อื่นๆ") {
    q0Other.classList.remove("hidden");
  } else {
    q0Other.classList.add("hidden");
    q0Other.value = "";
  }
  document.getElementById("q0Error").classList.add("hidden");
  q0Value = q0.value;
});

q0Other.addEventListener("input", () => {
  if (q0Other.value.trim() !== "") {
    document.getElementById("q0Error").classList.add("hidden");
  }
});

// Q1 logic
q1Options.forEach(opt => {
  opt.addEventListener("click", () => {
    q1Options.forEach(o => o.classList.remove("active"));
    opt.classList.add("active");
    q1Value = opt.dataset.value;

    // ซ่อน error ของ Q1 เมื่อเลือกแล้ว
    document.getElementById("q1Error").classList.add("hidden");

    if (q1Value === "1" || q1Value === "2") {
      q2Section.classList.remove("hidden");
      document.getElementById("q2Error").classList.add("hidden");    
    } else {
      q2Section.classList.add("hidden");
      q2Value = "";
      q2Other.value = "";
      q2Other.classList.add("hidden");
      document.querySelectorAll('input[name="q2"]').forEach(r => r.checked = false);
    }
  });
});

// Q2 logic
document.querySelectorAll('input[name="q2"]').forEach(radio => {
  radio.addEventListener("change", () => {
    document.getElementById("q2Error").classList.add("hidden");
    if (radio.value === "อื่นๆ") {
      q2Other.classList.remove("hidden");
    } else {
      q2Other.classList.add("hidden");
      q2Other.value = "";
    }
    q2Value = radio.value;
  });
});

// Q2 อื่นๆ text input
q2Other.addEventListener("input", () => {
  if (q2Other.value.trim() !== "") {
    document.getElementById("q2Error").classList.add("hidden");
  }
});

// handle submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let valid = true;

  // Q0 validation
  const finalQ0 = q0.value === "อื่นๆ" ? q0Other.value.trim() : q0.value;
  if (!finalQ0) {
    document.getElementById("q0Error").classList.remove("hidden");
    valid = false;
  } else {
    document.getElementById("q0Error").classList.add("hidden");
  }
  
  // Q1 validation
  if (!q1Value) {
    document.getElementById("q1Error").classList.remove("hidden");
    valid = false;
  } else {
    document.getElementById("q1Error").classList.add("hidden");
  }

  // Q2 validation
  let finalQ2 = "";
  if (q1Value === "1" || q1Value === "2") {
    let q2Checked = document.querySelector("input[name='q2']:checked");
    if (!q2Checked) {
      document.getElementById("q2Error").classList.remove("hidden");
      valid = false;
    } else {
      finalQ2 = q2Checked.value === "อื่นๆ" ? q2Other.value.trim() : q2Checked.value;
      if (q2Checked.value === "อื่นๆ" && !finalQ2) {
        document.getElementById("q2Error").classList.remove("hidden");
        valid = false;
      } else {
        document.getElementById("q2Error").classList.add("hidden");
      }
    }
  }

  if (!valid) return;

  // สร้าง FormData เพื่อส่งข้อมูล
  const formData = new FormData();
  formData.append(ENTRIES.q0, finalQ0);
  formData.append(ENTRIES.q1, q1Value);
  formData.append(ENTRIES.q2, finalQ2);
  formData.append(ENTRIES.q3, document.getElementById("q3").value.trim());

  // ✅ แสดง thank you page
  form.classList.add("hidden");
  thankYou.classList.remove("hidden");

  // Reset form
  form.reset();
  q1Options.forEach(o => o.classList.remove("active"));
  q1Value = "";
  q2Section.classList.add("hidden");
  q2Other.classList.add("hidden");
  q0Other.classList.add("hidden");

  // ส่งข้อมูลไป Google Forms เบื้องหลัง
  try {
    await fetch(FORM_ACTION_URL, {
      method: "POST",
      body: formData,
      mode: "no-cors"
    });
  } catch (err) {
    console.error("ส่งข้อมูลไม่สำเร็จ (background)", err);
  }
});

// ปุ่มทำใหม่
document.getElementById("againBtn").addEventListener("click", () => {
  thankYou.classList.add("hidden");
  form.classList.remove("hidden");
});