### JSON Structure
```
interface IDepartments {
  id: string;
  name: string;
}
interface IDataArray {
  name: string;
  departments: IDepartments[];
}

interface Filters {
  name?: string;
  departments?: string[];
}

const dataArray = [
  { name: 'Brainvire', departments: [
      {id: '1', name: 'Open Source'},
      {id: '2', name: 'Open Source Front End'},
    ]
  },
  { name: 'Info Tech', departments: [
      {id: '3', name: 'Magento'}
   ]
  },
  { name: 'Brainvire', departments: [
      {id: '4', name: 'Odoo'},
      {id: '5', name: 'Odoo Backend'}
    ]
  }
]

const filters = {
  name: 'brainvire',
  departments: ['2']
}
```

### Functionality
```
const applyFilters = (dataArray: IDataArray[], filters: Filters): IDataArray[] =>
  dataArray.filter((data) => {
    // name wise filter
    if (filters.name && filters.name.length > 0) {
      const nameMatched = data.name
        .toLowerCase()
        .includes(filters.name.toLowerCase());

      if (!nameMatched) {
        return false;
      }
    }

    // Department wise filter
    if (filters.departments.length) {
      const departmentsIds =
        data.departments?.map((depart) => depart.id) || [];

      const departmentMatched = filters.departments.some((departmentId) =>
        departmentsIds.includes(departmentId),
      );

      if (!departmentMatched) return false;
    }

    return true;
  });
```

### Function Calling
```

=> applyFilters(dataArray, filter)

```


### Output Structure
```
=> [{ name: 'Brainvire', departments: [
      {id: '1', name: 'Open Source'},
      {id: '2', name: 'Open Source Front End'},
    ]
  }]
```
