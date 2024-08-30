import { StaticRoutes } from "@config/staticurl.config";;
import Link from "next/link";
import { useRouter } from "next/router";


const MyAccountHeaderComponent = () => {
  const router = useRouter();
  const className = (url: string) => router?.query?.slug === url;

  return (
    <div className="account-tabbing-wrap">
      <ul className="account-tabbing-box">
        <li className={className("my-account") ? "tab-active" : ""}>
          <Link href={StaticRoutes.account}>
            <a>
              My Account
            </a>
          </Link >

        </li>
        <li className={className("my-orders") ? "tab-active" : ""}>
          <Link href={StaticRoutes.myOrders}>
            <a>
              My Orders
            </a>
          </Link >

        </li>
        <li className={className("user-address-book") ? "tab-active" : ""}>
          <Link href={StaticRoutes.userAdressBook}>
            <a>
              Address Book
            </a>
          </Link>
        </li>
        <li className={className("account-information") ? "tab-active" : ""}>
          <Link href={StaticRoutes.myProfile}>
            <a>
              Account Information
            </a>
          </Link>

        </li>
        <li className={className("newsletter-subscription") ? "tab-active" : ""}>
          <Link href={StaticRoutes.newsletterSubscription}>
            <a>
              Newsletter Subscriptions
            </a>
          </Link>
        </li>
      </ul>
    </div>


  );
};

export default MyAccountHeaderComponent;
