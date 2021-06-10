import React from "react";
import {createStyles, Theme, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Carousel} from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import clsx from "clsx";

export type ImageCarouselProps = ImageCarouselDataProps & ImageCarouselStyleProps & ImageCarouselEventProps;

export interface ImageCarouselDataProps {
  images: Array<string>;
}

export interface ImageCarouselStyleProps {

}

export interface ImageCarouselEventProps {

}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    indicator: {
      cursor: "pointer",
      display: "inline-block",
      borderRadius: "50%",
      backgroundColor: theme.palette.background.paper,
      boxShadow: "1px 1px 2px rgb(0 0 0 / 90%);",
      transition: theme.transitions.create("background-color", {
        easing: theme.transitions.easing.sharp,
        duration: 200,
      }),
      [theme.breakpoints.up("xs")]: {
        height: "1.6vw",
        width: "1.6vw",
        marginLeft: "0.8vw",
        marginRight: "0.8vw",
      },
      [theme.breakpoints.up("sm")]: {
        height: "10px",
        width: "10px",
        marginLeft: "5px",
        marginRight: "5px",
      },
      [theme.breakpoints.up("md")]: {
        height: "11px",
        width: "11px",
        marginLeft: "5.5px",
        marginRight: "5.5px",
      },
      [theme.breakpoints.up("lg")]: {
        height: "12px",
        width: "12px",
        marginLeft: "6px",
        marginRight: "6px",
      },
    },
    indicatorSelected: {
      backgroundColor: theme.palette.primary.main,
    },
  }),
);

const ImageCarousel: React.FC<ImageCarouselProps> = (props) => {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const {
    images,
  } = props;

  const renderIndicator = (clickHandler: (e: React.MouseEvent | React.KeyboardEvent) => void, isSelected: boolean, index: number, label: string): React.ReactNode => {
    return (
      <div className={clsx(classes.indicator, {
        [classes.indicatorSelected]: isSelected,
      })} onClick={clickHandler} key={index}/>
    );
  };

  return (
    <Carousel
      autoPlay
      emulateTouch
      infiniteLoop
      showStatus={false}
      showThumbs={false}
      interval={10000}
      renderIndicator={renderIndicator}
    >
      {
        images.map(image => (
          <div>
            <img src={image}/>
          </div>
        ))
      }
    </Carousel>
  );
};

export default ImageCarousel;

