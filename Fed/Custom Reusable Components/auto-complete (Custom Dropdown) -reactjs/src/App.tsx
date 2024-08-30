import AutoComplete from './component/autoComplete';
import '../src/assets/scss/main.scss';
import { ISelectedCountry } from './types/country';
import { useCallback } from 'react';

function App() {
  const selectedCountry = useCallback((data: ISelectedCountry) => {
    console.log(data);
  }, []);

  return (
    <div className='App'>
      <div className='input-col custom-control-focus'>
        <AutoComplete
          setCountryContact={selectedCountry}
          placeholder='Phone Number'
        />
      </div>
    </div>
  );
}

export default App;
