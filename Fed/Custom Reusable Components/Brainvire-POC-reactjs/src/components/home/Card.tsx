import { useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { HomePageData } from "./HomePageData";
import "../../assets/scss/card.scss";

const Card = () => {
  // Memoize the mapped cards to prevent unnecessary renders
  const memoizedCards = useMemo(
    () => HomePageData.map((card) => <CardItem key={card.id} card={card} />),
    []
  );

  return <>{memoizedCards}</>;
};

const CardItem = ({ card }) => {
  // Memoize the callback function for rendering links
  const renderLinks = useCallback(() => {
    return card.links.map((link) => (
      <Link to={link.to} key={link.id}>
        {link.label}
      </Link>
    ));
  }, [card.links]);

  return (
    <div className="card">
      <div className="image-container"></div>
      <div className="links">{renderLinks()}</div>
    </div>
  );
};

export default Card;
