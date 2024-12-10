

export function filterData(dataset, { age, gender, startDate, endDate }) {
  return dataset.filter(item => {
    const ageMatch = age === 'all' || item.ageGroup === age;
    console.log(age,"age");
    
    const genderMatch = gender === 'all' || item.gender === gender;
    const dateMatch =
      (!startDate || new Date(item.date) >= new Date(startDate)) &&
      (!endDate || new Date(item.date) <= new Date(endDate));
    return ageMatch && genderMatch && dateMatch;
  });
}
