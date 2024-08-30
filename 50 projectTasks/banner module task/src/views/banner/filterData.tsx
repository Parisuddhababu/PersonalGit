import Dropdown from "@components/dropdown/Dropdown";
import { Refresh, Search } from "@components/icons";
import TextInput from "@components/input/TextInput";
import { Status_DropDown_select } from "@config/constant";
import { useFormik } from "formik";
import { InitialValueProps } from "src/types/banner";
const FilterBannerData = ({ filterBanner }: any) => {
  /*initial values for filter data*/
  const initialValues: InitialValueProps = {
    bannerTitle: "",
    createdBy: "",
    status: null,
  };
  /*onsubmit*/
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      filterBanner(values);
    },
  });
  /*form reset handler*/
  const formResetHandler = () => {
    formik.resetForm();
    filterBanner(initialValues);
  };
  return (
    <div>
      <form
        onSubmit={formik.handleSubmit}
        className='w-full bg-white shadow-lg rounded-lg p-8 grid  mb-5 sm:grid-cols-1  lg:grid-cols-3  gap-6'>
        <div>
          <TextInput
            placeholder='banner title'
            label={"bannerTitle"}
            id='bannerTitle'
            name='bannerTitle'
            onChange={formik.handleChange}
            value={formik.values.bannerTitle}
          />
        </div>
        <div>
          <TextInput
            placeholder='created by'
            label={"createdBy"}
            id='createdBy'
            name='createdBy'
            onChange={formik.handleChange}
            value={formik.values.createdBy}
          />
        </div>
        <div>
          <Dropdown
            placeholder={"--select--"}
            name='status'
            label={"status_type"}
            onChange={formik.handleChange}
            value={formik.values.status as number}
            options={Status_DropDown_select}
            id='status'
          />
        </div>
        <div className='btn-group col-span-3 flex items-start justify-end'>
          <button type='submit' className='btn btn-primary'>
            <Search className='mr-1' /> Search
          </button>
          <button
            type='submit'
            onClick={formResetHandler}
            className='btn btn-warning'>
            <Refresh className='mr-1' />
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};
export default FilterBannerData;
