//Address Module - Exporting using default export.
let address = [];
//Default export - with no name required; and only one default export per module.
export default function (name, addressline, city, state) {
  let address1 = {
    name: name,
    address: addressline,
    city: city,
    state: state,
  };
  address.push(address1);
  console.log('AddressBook :: Address added : ', address);
}
