//     "Позначка часу",
//     "Чи працюєте ви зараз?",
//     "Де ви мешкаєте?",
//     "Ваша стать",
//     "Ваш вік",
//     "Яка у вас освіта?",
//     "Загальний стаж роботи в ІТ",
//     "Знання англійської мови",
//     "Оберіть вашу посаду",
//     "Middle",
//     "Вкажіть вашу основну спеціалізацію",
//     "Основна мова програмування",
//     "Інші мови програмування",
//     "Фреймворки, бібліотеки та платформи",
//     "Платформи, для яких розробляєте на поточному місці роботи?",
//     "Ваш тайтл",
//     "Вкажіть вашу спеціалізацію",
//     "Яку мову програмування використовуєте в роботі?",
//     "Оберіть вашу посаду_1",
//     "Ваш тайтл_2",
//     "Ваша посада",
//     "Ваш тайтл_3",
//     "Оберіть вашу посаду_4",
//     "Ваш тайтл_5",
//     "Ваша посада_6",
//     "Ваш тайтл_7",
//     "Ваша посада_8",
//     "Ваш тайтл_9",
//     "Ваша посада_10",
//     "Ваш тайтл_11",
//     "Ваша посада_12",
//     "Ваш тайтл_13",
//     "Ваша посада_14",
//     "В якій сфері працюєте ви / ваш поточний проєкт?",
//     "Тип компанії",
//     "Кількість спеціалістів у вашій компанії (в Україні)",
//     "Загальний стаж роботи за нинішньою спеціалізацією",
//     "Стаж на поточному місці роботи",
//     "Зарплата у $$$ за місяць, лише ставка після сплати податків",
//     "Наскільки змінилась ваша зарплата за останні 12 місяців?",
//     "Чи отримуєте ви грошові бонуси до зарплати?",
//     "Вкажіть суму цього бонуса у  після податків",
//     "Вкажіть ваш основний заклад вищої освіти (якщо вчилися в кількох – той, де провели найбільше часу)"

import DOU_2021_JUNE_RAW from "./2021_june_raw.js";
import CSS_COLOR_NAMES from "./css_colors.js";

// // TODO
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const cx = canvas.width / 2 - 150;
const cy = canvas.height / 2;
const radius = 300;

let startAngle = Math.PI * 2;
let rectXPos = canvas.width - 250;
let rectYPos = 20;
let rectYOffset = 0;

const devInfo = {
  city: 2,
  salary: 38,
  specialization: 10,
};

const frontendFiltered = DOU_2021_JUNE_RAW.filter(dev => dev[devInfo.specialization] === "Front-end");
const totalDevsAmount = frontendFiltered.length;

const frontendData = Object.entries(
                        frontendFiltered
                            .reduce((acc, curr) => {
                                const city = curr[devInfo.city];
                                const salary = +curr[devInfo.salary];
                                
                                if (!acc[city]) {
                                    acc[city] = { totalMoney: 0, totalDev: 0 };
                                }

                                acc[city].totalMoney += salary;
                                acc[city].totalDev += 1;
                                return acc;
                            }, {})
                        ).sort(([, { _a, totalDev: a }], [, { _b, totalDev: b }]) => Math.sign(b - a));

const avarageSalary = frontendData.map(([city, { totalMoney, totalDev }]) => (
    `Average salary of FE developers in ${city}: ${(totalMoney / totalDev).toFixed(2)}$`
)).join("\n");

// Draw pie chart
frontendData.forEach(([city, { _, totalDev }]) => {
    const percent = (totalDev * 100 / totalDevsAmount).toFixed(2);
    let endAngle = startAngle - (totalDev / totalDevsAmount) * 2 * Math.PI;
    
    const randomIndx = Math.floor(Math.random() * CSS_COLOR_NAMES.length);
    const randomColor = CSS_COLOR_NAMES[randomIndx];

    ctx.fillStyle = randomColor;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startAngle, endAngle, true);
    ctx.fill();
    ctx.closePath();

    // Draw rectangles with info
    ctx.beginPath();
    ctx.rect(rectXPos, rectYPos + rectYOffset, 20, 20);
    ctx.fill();

    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.fillText(`${city} (${percent}%)`, rectXPos + 40, rectYPos + rectYOffset + 15);
    ctx.closePath();

    rectYOffset += 30;
    startAngle = endAngle;
});

console.log(avarageSalary);