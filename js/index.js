import DocTienBangChu from "./transformNumberToText.js";

/* Global variable */
let isValidForm = [];

/*
    price1: price/km when distance < 1km
    price2: price/km when distance from 1,1km to 20km
    price3: price/km when distance from 20,1km
    priceWait: price/minute when taxi driver wait customer
*/
const arrayDetailPrice = [
  {
    name: "uberX",
    price1: 8000,
    price2: 12000,
    price3: 10000,
    priceWait: 2000,
  },
  {
    name: "uberSUV",
    price1: 9000,
    price2: 14000,
    price3: 12000,
    priceWait: 3000,
  },
  {
    name: "uberBlack",
    price1: 10000,
    price2: 16000,
    price3: 14000,
    priceWait: 4000,
  },
];

const detailInvoice = {
  dateInvoice: "",
  rangeOfCar: "",
  distace: 0,
  feeOfDistance: 0,
  waitTime: 0,
  feeOfWaitTime: 0,
};

/* Function validator input */
const validatorInput = (e) => {
  const elementTextValidator =
    e.target.parentElement.querySelector(".text-validator");
  if (e.target.value === "") {
    elementTextValidator.innerHTML = e.target.getAttribute("text-required");
    elementTextValidator.classList.add("show");
    isValidForm.push("false");
  } else if (e.target.value < 0) {
    elementTextValidator.innerHTML = e.target.getAttribute("text-validator");
    elementTextValidator.classList.add("show");
    isValidForm.push("false");
  } else {
    elementTextValidator.classList.remove("show");
    isValidForm.push("true");
  }
};

/* Function format number */
const formatNumber = (number) => {
  number = new Intl.NumberFormat("de-DE").format(number);
  return number;
  // type of number is string
};

/* Function count Distance fee */
const countDistanceFee = (nameCar, kilometers) => {
  let detailPrice = arrayDetailPrice.find((param) => {
    return param.name === nameCar;
  });
  if (kilometers <= 1) {
    return detailPrice.price1;
  } else if (kilometers > 1 && kilometers <= 20) {
    return detailPrice.price1 + (kilometers - 1) * detailPrice.price2;
  } else {
    return (
      detailPrice.price1 +
      19 * detailPrice.price2 +
      (kilometers - 20) * detailPrice.price3
    );
  }
};

/* Function count Wait time fee */
const countWaitTimeFee = (nameCar, minutes) => {
  let detailPrice = arrayDetailPrice.find((param) => {
    return param.name === nameCar;
  });
  return minutes * detailPrice.priceWait || 0;
};

/* Function get current date */
const getCurrentDate = () => {
  const d = new Date();
  let day = d.getDay();
  let date = d.getDate();
  let month = d.getMonth() + 1;
  let year = d.getFullYear();
  if (month < 10) {
    month = `0${month}`;
  }
  switch (day) {
    case 0:
      day = "Chủ nhật";
      break;
    case 1:
      day = "Thứ hai";
      break;
    case 2:
      day = "Thứ ba";
      break;
    case 3:
      day = "Thứ tư";
      break;
    case 4:
      day = "Thứ năm";
      break;
    case 5:
      day = "Thứ sáu";
      break;
    case 6:
      day = "Thứ bảy";
      break;
  }
  return `${date}/${month}/${year} (${day})`;
};

/* Function create invoice */
const createInvoice = (
  nameCar,
  kilometers,
  distanceFee,
  minutes,
  waitTimeFee
) => {
  detailInvoice.dateInvoice = getCurrentDate();
  detailInvoice.rangeOfCar = nameCar;
  detailInvoice.distace = kilometers;
  detailInvoice.feeOfDistance = distanceFee;
  detailInvoice.waitTime = minutes;
  detailInvoice.feeOfWaitTime = waitTimeFee;
};

/* Function print invoice */
const printInvoice = () => {
  document.querySelector("#date-invoice").innerHTML = detailInvoice.dateInvoice;

  let nameCar = detailInvoice.rangeOfCar;
  document.querySelector("#range-car").innerHTML = `Loại xe: ${nameCar}`;

  let distance = formatNumber(detailInvoice.distace);
  document.querySelector("#distance").innerHTML = `${distance} km`;

  let feeOfDistance = formatNumber(detailInvoice.feeOfDistance);
  document.querySelector(
    "#payment-distance"
  ).innerHTML = `${feeOfDistance} VNĐ`;

  let waitTime = formatNumber(detailInvoice.waitTime);
  document.querySelector("#wait-time").innerHTML = `${waitTime} phút`;

  let feeOfWaitTime = formatNumber(detailInvoice.feeOfWaitTime);
  document.querySelector(
    "#payment-wait-time"
  ).innerHTML = `${feeOfWaitTime} VNĐ`;

  let sumFee = formatNumber(
    detailInvoice.feeOfDistance + detailInvoice.feeOfWaitTime
  );
  document.querySelector("#sum-payment").innerHTML = `${sumFee} VNĐ`;
};

/* Function clean invoice after payment */
const cleanInvoice = () => {
  createInvoice("", 0, 0, 0, 0);

  //Hidden display sum fee and disabled btnInHoaDon
  document.querySelector("#divThanhTien").style.display = "none";
  document.querySelector("#btnInHoaDon").disabled = true;
};

/* DOM */
const inputDistance = document.querySelector("#soKM");
const inputWaitTime = document.querySelector("#thoiGianCho");
const radiosRangeOfCar = document.querySelectorAll("input[name='selector']");
const btnTinhTien = document.querySelector("#btnTinhTien");
const btnThanhToan = document.querySelector("#btnThanhToan");

/* Add event */
inputDistance.onblur = validatorInput;
inputWaitTime.onblur = validatorInput;

inputDistance.oninput = cleanInvoice;
inputWaitTime.oninput = cleanInvoice;
btnThanhToan.onclick = () => {
  cleanInvoice();
  inputDistance.value = "";
  inputWaitTime.value = "";
};

radiosRangeOfCar.forEach((radio) => {
  radio.onchange = cleanInvoice;
});

btnTinhTien.onclick = () => {
  // Validator input
  inputDistance.focus();
  inputWaitTime.focus();
  inputDistance.blur();
  inputWaitTime.blur();

  if (isValidForm.indexOf("false") == -1) {
    //Get range of car
    let nameCar = document.querySelector("input[name='selector']:checked").id;

    //Count fee
    let distanceFee = countDistanceFee(nameCar, inputDistance.value);
    let waitTimeFee = countWaitTimeFee(nameCar, inputWaitTime.value);
    let sumFee = distanceFee + waitTimeFee;

    // Create invoice
    createInvoice(
      nameCar,
      inputDistance.value,
      distanceFee,
      inputWaitTime.value,
      waitTimeFee
    );

    // Display sum fee
    document.querySelector("#xuatTien").innerHTML = formatNumber(sumFee);
    document.querySelector("#xuatChu").innerHTML = DocTienBangChu(sumFee);
    document.querySelector("#divThanhTien").style.display = "block";
    document.querySelector("#btnInHoaDon").disabled = false;

    // Print invoice
    printInvoice();
  }

  // clean array isValidForm
  isValidForm = [];
};
