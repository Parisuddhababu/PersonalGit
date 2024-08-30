import { ROUTES } from "@/config/staticUrl.config";
import { IMAGE_PATH } from "@/constant/imagePath";
import "@/styles/pages/payment.scss";
import { IPaymentProps } from "@/types/components";
import Image from "next/image";
import Link from "next/link";

const PaymentStatus = ({ status, message }: IPaymentProps) => {
  return (
    <div className="payment-wrapper">
      <div className="payment-card">
        <Image className="spacing-20 payment-card-icon" alt={status} src={status === "success" ? IMAGE_PATH.paymentSuccess : IMAGE_PATH.paymentFailed}  width={120} height={120} style={{objectFit:"contain"}}/>
        <h1 className="spacing-40 h2">{message}</h1>
        <Link href={`/${ROUTES.private.myPlans}`}>
          <button className="btn btn-secondary">Go to my plans</button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentStatus;
