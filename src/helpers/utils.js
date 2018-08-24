export default {
  currencyFormat (input) {
    // first round to 2 decimals
    input = +(Math.round(input + 'e+2') + 'e-2')

    // esnure always 2 decimal places
    input = input.toFixed(2)

    // add commas
    input = input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return input
  }
}
