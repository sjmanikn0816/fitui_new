export const generateHTMLContent = (mealPlan: any, customerName: string, additionalNotes: string) => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const renderMealSection = (title: string, meals: any[]) => {
    if (!meals || meals.length === 0) return "";
    return `
      <div style="margin-bottom: 30px;">
        <h3 style="color: #374151; font-size: 18px; margin-bottom: 15px;">${title}</h3>
        ${meals
          .map(
            (meal) => `
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <h4>${meal.name || "Meal"}</h4>
            </div>
          `
          )
          .join("")}
      </div>
    `;
  };

  const plan = mealPlan?.daily_plan || mealPlan;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Meal Plan - ${customerName || "Customer"}</title>
      </head>
      <body>
        <h1>Your Personalized Meal Plan</h1>
        <p>${today}</p>
        ${additionalNotes ? `<p>${additionalNotes}</p>` : ""}
        ${renderMealSection("Breakfast", plan?.breakfast_options)}
        ${renderMealSection("Lunch", plan?.lunch_options)}
        ${renderMealSection("Dinner", plan?.dinner_options)}
      </body>
    </html>
  `;
};
