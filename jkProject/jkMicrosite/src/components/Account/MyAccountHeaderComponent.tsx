import { ISignInReducerData } from "@type/Common/Base";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const MyAccountHeaderComponent = () => {
  const signIndata = useSelector((state: ISignInReducerData) => state);
  const router = useRouter();

  const className = (url: string) => router.asPath === `${url}/`;

  return (
    <div id="tabs" className="tabs">
      <ul className="nav nav-tabs">
        <li className={className("/my-profile") ? "active" : ""}>
          <Link href="/my-profile">
            <a>
              <i className="jkm-user"></i>My Profile
            </a>
          </Link>
        </li>
        {signIndata?.signIn?.userData?.user_detail?.login_usertype &&
          (parseInt(signIndata?.signIn?.userData?.user_detail?.login_usertype) ==
            2 ||
            parseInt(signIndata?.signIn?.userData?.user_detail?.login_usertype) ==
            3) ? (
          <li className={className("/account") ? "active" : ""}>
            <Link href="/account">
              <a>
                <i className="jkm-info-circle"></i>Account
              </a>
            </Link>
          </li>
        ) : (
          <></>
        )}
        <li className={className("/change-password") ? "active" : ""}>
          <Link href="/change-password">
            <a>
              <i className="jkm-lock"></i>Change Password
            </a>
          </Link>
        </li>
        <li className={className("/user-address-book") ? "active" : ""}>
          <Link href="/user-address-book">
            <a>
              <i className="jkm-location"></i>Address Book
            </a>
          </Link>
        </li>
        <li
          className={
            className("/my-wishlist") ? "active" : ""
          }
        >
          <Link href="/my-wishlist">
            <a>
              <i className="jkm-heart"></i>My Wishlist
            </a>
          </Link>
        </li>
        <li className={className("/my-orders") ? "active" : ""}>
          <Link href="/my-orders">
            <a>
              <i className="jkm-shopping-bag"></i>My Order
            </a>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default MyAccountHeaderComponent;
