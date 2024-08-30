import { ChangeStatusProps } from "src/types/common";
const ChangeStatus = ({ onClose, changeStatus }: ChangeStatusProps) => {
  return (
    <>
      <div
        id='changeUserStatusModel'
        tabIndex={-1}
        data-modal-show={true}
        aria-hidden='false'
        className={
          "fixed top-0 left- right-0 z-50  w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] backdrop-blur-sm"
        }>
        <div className='flex justify-center'>
          {/* <!-- Modal content --> */}
          <div className='relative w-full max-w-2xl max-h-full bg-slate-200 '>
            <div className='flex items-start justify-between p-4 border-b rounded-t bg-red-500'>
              <h3 className='text-xl font-semibold text-white'>Confirmation</h3>
              <button onClick={onClose} className='btn btn-primary'>
                X
              </button>
            </div>
            <div className='p-6 space-y-6'>
              <p>Are you sure you want to change status?</p>
            </div>
            {/* <!-- Modal footer --> */}
            <div className='m-1 p-1 flex justify-end'>
              <button onClick={changeStatus} className='btn btn-primary m-1'>
                yes
              </button>
              <button onClick={onClose} className='btn btn-warning m-1'>
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangeStatus;
