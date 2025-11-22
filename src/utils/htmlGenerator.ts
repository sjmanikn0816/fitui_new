const formatDate = (): string => {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};
const renderNutritionPills = (nutrition: any): string => {
  if (!nutrition) return "";
  return `
    <div style="display: flex; gap: 16px; margin-top: 20px; flex-wrap: wrap; justify-content: center;">
      ${[
        { label: "Protein", value: `${nutrition.protein_g || 0}g` },
        { label: "Carbs", value: `${nutrition.carbs_g || 0}g` },
        { label: "Fat", value: `${nutrition.fat_g || 0}g` },
      ]
        .map(
          (n) => `
          <div style="
            background: #F1F5F9;
            border: 1px solid #D1D5DB;
            padding: 14px 26px;
            border-radius: 35px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.05);
          ">
            <span style="font-size: 16px; font-weight: 600; color: #334155;">${n.label} :</span>
            <span style="font-size: 18px; font-weight: 800; color: #111827;">${n.value}</span>
          </div>
        `
        )
        .join("")}
    </div>
  `;
};
const renderIngredients = (ingredients: string[]): string => {
  if (!ingredients?.length) return "";
  return `
    <div style="margin-top: 16px;">
      <h5 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700; color: #374151;">Ingredients</h5>
      <ul style="margin: 0; padding-left: 18px; color: #4B5563; font-size: 14px;">
        ${ingredients.map((i) => `<li style="margin-bottom: 4px;">${i}</li>`).join("")}
      </ul>
    </div>
  `;
};
const renderInstructions = (instructions: string[]): string => {
  if (!instructions?.length) return "";
  return `
    <div style="margin-top: 20px;">
      <h5 style="margin: 0 0 10px 0; font-size: 18px; font-weight: 700; color: #374151;">
        Preparation Steps
      </h5>
      <ol style="margin: 0; padding-left: 22px; color: #374151; font-size: 16px; line-height: 1.7;">
        ${instructions
          .map(
            (i) =>
              `<li style="margin-bottom: 10px;">${i}</li>`
          )
          .join("")}
      </ol>
    </div>
  `;
};
const renderMeal = (meal: any, index: number): string => {
  return `
    <div style="break-inside: avoid; margin-bottom: 22px; border-radius: 12px; border: 1px solid #E5E7EB; background: white; padding: 22px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
        <div>
          <h4 style="margin: 0; font-size: 22px; font-weight: 800; color: #111827;">${meal.name || "Meal " + (index + 1)}</h4>
          ${meal.description
      ? `<p style="margin: 6px 0 0; color: #6B7280; font-size: 15px;">${meal.description}</p>`
      : ""
    }
        </div>
        ${meal.nutrition
      ? `
          <div style="background: #F9FAFB; border-radius: 8px; padding: 8px 12px; text-align: center; border: 1px solid #E5E7EB;">
            <div style="font-size: 20px; font-weight: 800; color: #111827;">${meal.nutrition.calories || 0}</div>
            <div style="font-size: 11px; color: #6B7280;">kcal</div>
          </div>
        `
      : ""
    }
      </div>
      ${renderNutritionPills(meal.nutrition)}
      ${renderIngredients(meal.recipe?.ingredients)}
      ${renderInstructions(meal.recipe?.instructions)}
    </div>
  `;
};
const renderMealSection = (title: string,  meals: any[], isFirst = false): string => {
  if (!meals?.length) return "";
  return `
    <div ${!isFirst ? 'class="page-break"' : ""} style="margin-bottom: 40px;">
      <div style="background: #F3F4F6; padding: 26px; border-radius: 14px; margin-bottom: 22px;">
        <h2 style="margin: 0; font-size: 38px; color: #111827; font-weight: 900; text-align: center; letter-spacing: -0.6px;">
           ${title}
        </h2>
      </div>
      ${meals.map((m, i) => renderMeal(m, i)).join("")}
    </div>
  `;
};
const renderNutritionTargets = (targets: any): string => {
  if (!targets) return "";
  return `
    <div style="background: white; padding: 28px; border-radius: 14px; border: 1px solid #E5E7EB; margin-bottom: 36px;">
      <h3 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 900; color: #111827; text-align: center;">
        Daily Nutrition Targets
      </h3>
      <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
        ${[
          { label: "Calories", value: targets.calories },
          { label: "Protein", value: `${targets.protein_g || 0}g` },
          { label: "Carbs", value: `${targets.carbs_g || 0}g` },
          { label: "Fat", value: `${targets.fat_g || 0}g` },
        ]
          .map(
            (t) => `
            <div style="
              width: 80%;
              background: #F9FAFB;
              border: 1px solid #E5E7EB;
              padding: 18px;
              border-radius: 12px;
              text-align: center;
              box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            ">
              <div style="font-size: 28px; font-weight: 800; color: #111827;">${t.value}</div>
              <div style="font-size: 14px; color: #6B7280; margin-top: 4px;">${t.label}</div>
            </div>
          `
          )
          .join("")}
      </div>
    </div>
  `;
};
const renderHeader = (customerName: string): string => {
  return `
    <div style="text-align: center; margin-bottom: 32px; padding: 32px 20px; border-radius: 16px; background: linear-gradient(135deg, #F8FAFC, #E2E8F0); border: 1px solid #E5E7EB;">
      <h1 style="margin: 0 0 10px 0; font-size: 36px; font-weight: 900; color: #111827;">Personalized Meal Plan</h1>
      <p style="margin: 0; color: #475569; font-size: 15px;">Date: ${formatDate()} ${customerName ? ` | For: <strong>${customerName}</strong>` : ""
    }</p>
    </div>
  `;
};
const renderNotes = (notes: string): string => {
  if (!notes) return "";
  return `
    <div style="background: #FEFCE8; border-left: 4px solid #FACC15; padding: 18px 22px; border-radius: 10px; margin-bottom: 28px;">
      <p style="margin: 0; font-size: 15px; color: #78350F; line-height: 1.6;">
        <strong>Note:</strong> ${notes}
      </p>
    </div>
  `;
};
const renderFooter = (): string => {
  return `
    <div style="text-align: center; margin-top: 40px; font-size: 13px; color: #9CA3AF;">
      <p style="margin: 0;">Generated by <strong style="color: #4F46E5;">fitAi</strong> | © ${new Date().getFullYear()}</p>
    </div>
  `;
};
export const generateMealPlanHTML = (
  mealPlan: any,
  customerName: string,
  additionalNotes: string
): string => {
  const plan = mealPlan?.daily_plan || mealPlan;
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Meal Plan - ${customerName || "Customer"}</title>
        <style>
          @page { margin: 16mm; size: A4; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.5;
            background: #F8FAFC;
            color: #111827;
            margin: 0;
            padding: 24px;
          }
          * { box-sizing: border-box; }
          .page-break {
            page-break-before: always;
            break-before: page;
          }
          .page-break-avoid {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          @media print {
            .page-break { page-break-before: always; break-before: page; }
            body { background: white; }
          }
        </style>
      </head>
      <body>
        ${renderHeader(customerName)}
        <!-- Page 1: Notes + Nutrition + Breakfast -->
        <div class="page-break-avoid">
          ${renderNotes(additionalNotes)}
          ${renderNutritionTargets(plan?.daily_nutrition_target)}
        </div>
        <div class = "page-break">
          ${renderMealSection("Breakfast",  plan?.breakfast_options, true)}
        </div>
        <div class="page-break">
          ${renderMealSection("Lunch", plan?.lunch_options)}
        </div>
        <div class="page-break">
          ${renderMealSection("Dinner",  plan?.dinner_options)}
        </div>
        ${renderFooter()}
      </body>
    </html>
  `;
};