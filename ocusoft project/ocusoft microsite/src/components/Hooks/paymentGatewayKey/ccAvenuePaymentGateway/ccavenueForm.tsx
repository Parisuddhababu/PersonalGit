export interface CCAvenueFormProps {
  accessCode?: string;
}

const CCAvenueForm = ({ accessCode }: CCAvenueFormProps) => {
  return (
    <form
      id="nonseamless"
      method="post"
      name="redirect"
      className="hidden"
      action="https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction"
    >
      <input type="hidden" id="encRequest" name="encRequest" value="" />
      <input type="hidden" name="access_code" id="access_code" value={accessCode} />
    </form>
  );
};
export default CCAvenueForm;
