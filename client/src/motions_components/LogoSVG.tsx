import { motion,Variants } from "motion/react";
const LogoSVG = () => {
  const svgVariants:Variants = {
    start: {
      opacity: 0,
      pathLength: 0,
    },
    finished: {
      opacity: 1,
      pathLength: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      type: 'spring' as const,  
      },
    },
  };

  return (
    <svg
      className="text-main lg:w-36 w-28"
      version="1.1"
      id=""
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 670.1 186"
      xmlBase="preserve"
    >
      <g id="new_itc_logoSVG" transform="translate(-1115 -133)">
        <g id="Group_649" transform="translate(952)">
          <motion.path
            variants={svgVariants}
            style={{ fill: "#93ce03" }}
            initial="start"
            animate="finished"
            id="Path_39620"
            className="st0"
            d="M354.7,196.1l-46.5-45.6c-21.9-22.5-57.9-22.9-80.4-1c-0.3,0.3-0.7,0.7-1,1l-46.4,45.6
        c-22.4,21.8-22.9,57.5-1.1,80c0.4,0.4,0.7,0.7,1.1,1.1l5.9,5.8c10.5,10.3,64.8,33.7,69.7,35.6v-88.5c-0.1-2.8-1.9-5.2-4.5-6.2
        l-29-11.4c-6.4,5.3-16.1,4-20.6-3.2c-3.6-5.7-2.5-13.4,2.6-17.8c5.9-5.1,14.8-4.5,19.7,1.5c1.7,2.1,2.8,4.6,3.1,7.2l28.2,11
        c7.7,3.1,16.2,3.1,23.9,0l28.2-11c0.9-7.6,7.9-13,15.5-12c7.6,0.9,13,7.9,12,15.5c-0.9,7.6-7.9,13-15.5,12
        c-2.7-0.3-5.2-1.4-7.2-3.1l-29,11.4c-2.6,1-4.4,3.4-4.5,6.2v88.4c4.9-2,59.2-25.4,69.7-35.6l5.9-5.8c22.4-21.8,22.8-57.6,1-80.1
        C355.4,196.8,355,196.5,354.7,196.1L354.7,196.1z M267.7,193.9c-9.3,0-16.8-7.5-16.8-16.8s7.5-16.8,16.8-16.8s16.8,7.5,16.8,16.8
        c0,4.5-1.8,8.7-4.9,11.9C276.4,192.1,272.1,193.9,267.7,193.9L267.7,193.9z"
          />
          <motion.path
            id="Path_39621"
            className="st1"
            variants={svgVariants}
            style={{ fill: "#93ce03" }}
            initial="start"
            animate="finished"
            d="M355.9,197.1L279,303v16c4.9-2,59.5-25.5,70-35.8l5.9-5.8
        C377.3,255.5,377.8,219.5,355.9,197.1L355.9,197.1z"
          />
          <motion.path
            id="Path_39622"
            className="st2"
            variants={svgVariants}
            style={{ fill: "#93ce03" }}
            initial="start"
            animate="finished"
            d="M227,198.3l6.3-34l20.1,3.7c5-7.9,15.4-10.2,23.3-5.2c3.9,2.5,6.6,6.4,7.5,10.9l59.6,11.1
        l-35.3-34.6c-22-22.6-58.2-23-80.7-1c-0.3,0.3-0.7,0.7-1,1L180.2,196c-22.5,21.9-23,57.8-1.1,80.3c0.4,0.4,0.7,0.7,1.1,1.1
        l5.9,5.8c3.6,3.5,12.4,8.6,22.6,13.9l15.6-83.9l-1.8-0.7c-5.9,4.9-14.7,4.2-19.6-1.7s-4.2-14.7,1.7-19.6s14.7-4.2,19.6,1.7
        C225.5,194.4,226.5,196.3,227,198.3z"
          />
          <motion.path
            id="Path_39623"
            className="st3"
            variants={svgVariants}
            style={{ fill: "#93ce03" }}
            initial="start"
            animate="finished"
            d="M298.4,142l-65.3,22l-5.1-15C247.1,130.7,276.2,127.8,298.4,142z"
          />
        </g>
        <g id="Group_5" transform="translate(3855.512 -70.154)">
          <g id="Group_4" transform="translate(-2485.834 239.48)">
            <g id="Group_2" transform="translate(0)">
              <motion.path
                variants={svgVariants}
                style={{ fill: "#93ce03" }}
                initial="start"
                animate="finished"
                id="Path_2"
                className="st4"
                d="M-15.5,26.1h11v60h-11V26.1z"
              />
              <motion.path
                variants={svgVariants}
                style={{ fill: "#93ce03" }}
                initial="start"
                animate="finished"
                id="Path_3"
                className="st4"
                d="M48.5,35.1h-17v52h-11v-52h-18v-9h46V35.1z"
              />
              <motion.path
                variants={svgVariants}
                style={{ fill: "#93ce03" }}
                initial="start"
                animate="finished"
                id="Path_4"
                className="st4"
                d="M69.1,56.7c0-18.9,12-31.6,29.9-31.6c15.4,0,26.6,9.2,28.2,23h-10.8C115.2,39.7,108.3,34,99,34
                C87.9,34,80.5,43,80.5,56.7S87.9,79.4,99,79.4c9.3,0,16.2-5.7,17.4-14.3h10.8C125.6,79,114.4,88.2,99,88.2
                C81,88.1,69.1,75.5,69.1,56.7z"
              />
              <motion.path
                variants={svgVariants}
                style={{ fill: "#93ce03" }}
                initial="start"
                animate="finished"
                id="Path_5"
                className="st4"
                d="M178.5,78v8.1h-43v-60h42v9h-31v16h28v9h-28v18L178.5,78z"
              />
              <motion.path
                variants={svgVariants}
                style={{ fill: "#93ce03" }}
                initial="start"
                animate="finished"
                id="Path_6"
                className="st4"
                d="M236.5,26.1v60h-10.2l-27.6-43h-0.2l0.2,43h-10.2v-60H199l27.3,44h0.2l-0.2-44H236.5z"
              />
              <motion.path
                variants={svgVariants}
                style={{ fill: "#93ce03" }}
                initial="start"
                animate="finished"
                id="Path_7"
                className="st4"
                d="M290.5,35.1h-18v52h-11v-52h-17v-9h46V35.1z"
              />
              <motion.path
                variants={svgVariants}
                style={{ fill: "#93ce03" }}
                initial="start"
                animate="finished"
                id="Path_8"
                className="st4"
                d="M341.5,78v8.1h-43v-60h42v9h-31v16h28v9h-28v18L341.5,78z"
              />
              <motion.path
                id="Path_9"
                variants={svgVariants}
                style={{ fill: "#93ce03" }}
                initial="start"
                animate="finished"
                className="st4"
                d="M375.1,62.1h-13.5v25h-11v-61h23.7c13.3,0,22.3,6.9,22.3,17.1c0,7.9-4.5,13.9-12,16.8
                l14.2,26.1h-11.5L375.1,62.1z M361.5,54.1h13.3c6.3,0,10.5-3.8,10.5-9.7c0-5.5-4.2-9.3-10.5-9.3h-13.3V54.1z"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};
export default LogoSVG;
