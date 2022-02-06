import { Col, Row } from "antd";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ArticleCard } from "./ArticleCard";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const LatestArticles = () => {
  return (
    <div className="w-full">
      <Row className="">
        <Col span={4} className="mb-2 text-3xl">
          <span className="flex">Latest Articles</span>
          <hr
            className="max-w-xs font-bold mb-6"
            style={{ height: "1px", border: "none", color: "#333", backgroundColor: "#333" }}
          />
        </Col>
        <Col span={4}>
          <span
            onClick={() => {
              console.log("following clicked");
            }}
          >
            following
          </span>
        </Col>
        <Col span={4}>
          <span
            onClick={() => {
              console.log("favorites clicked");
            }}
            className="-mt-5"
          >
            favorites
          </span>
        </Col>
        <Col span={4}>
          <span
            onClick={() => {
              console.log("click left");
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="red">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
              />
            </svg>
          </span>
        </Col>
        <Col span={4}>
          <span
            onClick={() => {
              console.log("click right");
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="red">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
        </Col>
      </Row>

      <Carousel responsive={responsive}>
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
      </Carousel>
    </div>
  );
};

export default LatestArticles;
