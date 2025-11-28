import { customAlphabet } from "nanoid";

export const generatePIN = (): number => {
  let pin = "";
  for (let i = 0; i < 6; i++) {
    pin += Math.floor(Math.random() * 10);
  }
  if (pin.length < 6) {
    generatePIN();
  }
  return parseInt(pin);
};


export const generateRideId = () => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const generateRideId = customAlphabet(alphabet, 8);

  return `RIDE-${generateRideId()}`;
};


export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];