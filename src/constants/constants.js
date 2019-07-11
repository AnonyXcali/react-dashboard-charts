export const options = [
  { key: 'br', text: 'bar', value: 'bar' },
  { key: 'ln', text: 'line', value: 'line' },
  { key: 'pe', text: 'pie', value: 'pie' }
]
//'Name', 'Title(x-axis)','Categories(x-axis)','Title(y-axis)','Series','Legends'
export const nonRadialFormTypes = [
  { key: 'nm', text: 'Name', value: 'Name' },
  { key: 'tx', text: 'Title(x-axis)', value: 'Title(x-axis)' },
  { key: 'cx', text: 'Categories(x-axis)', value: 'Categories(x-axis)' },
  { key: 'ty', text: 'Title(y-axis)', value: 'Title(y-axis)' },
  { key: 'sr', text: 'Series', value: 'Series' }
]

export const radialFormTypes = [
  { key: 'nm', text: 'Name', value: 'Name' },
  { key: 'lb', text: 'Labels', value: 'Labels' },
  { key: 'sr', text: 'Series', value: 'Series' }
]


export default {
    options,
    nonRadialFormTypes,
    radialFormTypes
}
