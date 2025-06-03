import axios from 'axios';

export const fetchEquipmentsData = async (recordForEdit) => { 
  try {
    const responses = await Promise.all([
      axios.get('/api/equipments'),
      axios.get('/api/equipments/departments'),
      axios.get('/api/equipments/equipmentname'),
      axios.get('/api/equipments/unitname'),
      axios.get('/api/equipments/equipmentstatus'),
      axios.get('/api/equipments/category'),
      axios.get('/api/equipments/subcategory'),
      axios.get('/api/equipments/maintpriority'),
      axios.get('/api/equipments/maintperiodicity'),
      axios.get('/api/equipments/model'),
      axios.get('/api/equipments/billno'),
      axios.get('/api/equipments/warranty'),
      axios.get('/api/equipments/supplier')

    ]);
    const data = {
      equip: responses[0].data,
      dept: responses[1].data,
      equipname: responses[2].data,
      hospname: responses[3].data,
      status: responses[4].data,
      category: responses[5].data,
      subcategory: responses[6].data,
      maintpriority: responses[7].data,
      maintperiodicity: responses[8].data,
      model: responses[9].data,
      billno: responses[10].data,
      warranty: responses[11].data,
      supplier: responses[12].data,
    };
    return JSON.stringify(data); // Convert the data object to a JSON string
  } catch (error) {
    console.error('Error fetching equipment data', error);
    throw error; // Rethrow the error for handling in the component
  }
};

export const fetchSearchEquipments = async (filters = {}) => {
  try {
    let endpoint = `/api/equipments`;
    console.log(filters)
    // Build query string if filters exist
    const queryParams = new URLSearchParams(
      Object.entries(filters).filter(([_, value]) => value)
    ).toString();
   
    if (queryParams) {
      endpoint += `/search?${queryParams}`;
    }
    console.log("Fetching data from:", endpoint);
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    
    console.error('Error fetching equipment data:', error?.response || error.message);
    throw error;
  }
};
export const fetchHospitalData = async (recordForEdit) => { 
  try {
    const responses = await Promise.all([
      axios.get('/api/psa'),
      
    ]);
    const data = {
      equip: responses[0].data,
     
    };
    return JSON.stringify(data); // Convert the data object to a JSON string
  } catch (error) {
    console.error('Error fetching equipment data', error);
    throw error; // Rethrow the error for handling in the component
  }
};
export const fetchSearchHospitalData = async (filters = {}) => {
  try {
    let endpoint = `/api/psa`;
    //console.log(filters,'hi')
    // Build query string if filters exist
    const queryParams = new URLSearchParams(
      Object.entries(filters).filter(([_, value]) => value)
    ).toString();
   console.log(queryParams)
    if (queryParams) {
      endpoint += `/search?${queryParams}`;
    }
    console.log("Fetching data from:", endpoint);
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    
    console.error('Error fetching equipment data:', error?.response || error.message);
    throw error;
  }
};