export function isValidCPF(value: string) {
  if (typeof value !== "string") return false;

  value = value.replace(/[^\d]+/g, "");

  if (value.length !== 11 || !!value.match(/(\d)\1{10}/)) {
    return false;
  }

  const digits = value.split("").map((el) => +el);

  function getVerifyingDigit(arr: number[]) {
    const reduced = arr.reduce(
      (sum, digit, index) => sum + digit * (arr.length - index + 1),
      0
    );
    return ((reduced * 10) % 11) % 10;
  }

  return (
    getVerifyingDigit(digits.slice(0, 9)) === digits[9] &&
    getVerifyingDigit(digits.slice(0, 10)) === digits[10]
  );
}
