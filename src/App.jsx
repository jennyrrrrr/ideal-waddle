import "./App.css";
import { scaleLinear, scaleLog, scaleBand, line } from "d3";
import { throttle } from "lodash";
import { AxisLeft, AxisBottom } from "@visx/axis";
import React, {useState, useCallback} from "react";

import usvideos_max from "./cleaned_df_max4";
import usvideos_full from "./cleaned_df_full4";


function App() {
  var start = 0;

  const cat_cols = {
    1: "#a18276",
    2: "#f27474",
    10: "#66d7d1",
    15: "#ffb4a2",
    17: "#8e7dbe",
    20: "#a1c084",
    22: "#add7f6",
    23: "#f2d0a9",
    24: "#e5989b",
    25: "#9ac2c9",
    26: "#b3f78b",
    27: "#848586",
    28: "#f4d06f",
    29: "#eec6ca",
  };

  const cat_id_to_names = {
    1: "Film & Animation",
    2: "Autos & Vehicles",
    10: "Music",
    15: "Pets & Animals",
    17: "Sports",
    19: "Travel & Events",
    20: "Gaming",
    22: "People & Blogs",
    23: "Comedy",
    24: "Entertainment",
    25: "News & Politics",
    26: "Howto & Style",
    27: "Education",
    28: "Science & Technology",
    29: "Nonprofits & Activism",
  };

  const cat_to_t_view = {
    24: "55,259 M",
    10: "55,225 M",
    20: "31,309 M",
    17: "16,395 M",
    22: "14,378 M",
    23: "9,533 M",
    1: "7,430 M",
    28: "6,747 M",
    25: "4,089 M",
    27: "3,293 M",
    26: "2,960 M",
    2: "1,322 M",
    19: "529 M",
    15: "455 M",
    29: "112 M",
  };

  const cats = [24, 10, 20, 17, 22, 23, 1, 28, 25, 27, 26, 2, 19, 15, 29];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const group_count = [
    2928,
    1272,
    12051,
    347,
    7732,
    337,
    15206,
    6701,
    4146,
    15318,
    2544,
    1933,
    1713,
    2269,
    63
  ];

  var point = null;
  var [selectedCats, setSelectedCats] = useState(cats);
  var [selectedPoint, setSelectedPoint] = useState(point);
  var points = Array.from(Array(usvideos_max.length).keys());
  var [selectedPoints, setSelectedPoints] = useState(points);
  var hover = null;
  var [selectedHover, setSelectedHover] = useState(hover);
  var catHover = null;
  var [selectedCatHover, setSelectedCatHover] = useState(catHover);
  var dbsetSelectedPoint = throttle(setSelectedPoint, 200);
  var dbsetSelectedHover = throttle(setSelectedHover, 200);
  // const hovehandler = event => {
  //   setSelectedHover
  // };

  const _scaleX2 = scaleLinear().domain([0, 365]).range([70, 1100]);
   const _scaleX3 = scaleLinear().domain([0, 40]).range([70, 1100]);

  const _scaleY2 = scaleLog().domain([59832, 264407389]).range([550, 50]);
  const _scaleY3 = scaleLog().domain([1, 264407389]).range([550, 50]);

  const _scaleDate = scaleBand().domain(months).range([70, 1100]);

  const _lineMaker = line()
    .x((d) => {
      return _scaleX3(d[1]);
    })
    .y((d) => {
      return _scaleY3(d[0]);
    });

  function get_index_by_column_value(col_name, col_value, data) {
    var inds = [];
    for (var i = 0; i < data.length; i += 1) {
      if (data[i][col_name] == col_value) {
        inds.push(i);
      }
    }
    return inds;
  }

  const ids_by_cat = {};
  for (var i = 0; i < usvideos_max.length; i += 1) {
      if (!ids_by_cat[usvideos_max[i]["categoryId"]]) {
        ids_by_cat[usvideos_max[i]["categoryId"]] = [];
      }
      ids_by_cat[usvideos_max[i]["categoryId"]].push(i);
  }
  console.log(ids_by_cat)

  function clickCircle(cat) {
    var cat = cat.toString();
    var circles = document.getElementsByClassName(cat);

    for (var i = 0; i < circles.length; i += 1) {
      var circle = circles[i];
      if (circle.getAttribute("opacity") == 0.15) {
        circle.setAttribute("opacity", 1.0);
        circle.setAttribute("stroke", "black");
      } else {
        circle.setAttribute("opacity", 0.15);
        circle.setAttribute("stroke", "white");
      }
    }

    var cat = "cat" + cat.toString();
    var cat_circle = document.getElementById(cat);
    // console.log(cat_circle)
    if (cat_circle.getAttribute("opacity") == 0.15) {
      cat_circle.setAttribute("opacity", 1.0);
      cat_circle.setAttribute("stroke", "#808080");
    } else {
      cat_circle.setAttribute("opacity", 0.15);
      cat_circle.setAttribute("stroke", "white");
    }
  }

  const HoverText = () => {
    return (
      <g styles={{ zIndex: 1000, position: "fixed", backgroundColor: "red" }}>
        <rect
          width={270}
          height={100}
          x={
            25 +
            _scaleX2(parseInt(usvideos_max[selectedPoint]["trending_date"]))
          }
          y={_scaleY2(usvideos_max[selectedPoint]["view_count"])}
          fill="white"
          stroke={"black"}
        ></rect>
        <text
          x={
            30 +
            _scaleX2(parseInt(usvideos_max[selectedPoint]["trending_date"]))
          }
          y={20 + _scaleY2(usvideos_max[selectedPoint]["view_count"])}
        >
          <tspan
            x={
              30 +
              _scaleX2(parseInt(usvideos_max[selectedPoint]["trending_date"]))
            }
          >
            {usvideos_max[selectedPoint]["title"].substring(0, 26) + "..."}
          </tspan>
          <tspan
            x={
              30 +
              _scaleX2(parseInt(usvideos_max[selectedPoint]["trending_date"]))
            }
            dy={20}
            fontSize={12}
          >
            {"Channel: " + usvideos_max[selectedPoint]["channelTitle"]}
          </tspan>
          <tspan
            x={
              30 +
              _scaleX2(parseInt(usvideos_max[selectedPoint]["trending_date"]))
            }
            dy={18}
            fontSize={12}
          >
            {"Category : " +
              cat_id_to_names[usvideos_max[selectedPoint]["categoryId"]]}
          </tspan>
          <tspan
            x={
              30 +
              _scaleX2(parseInt(usvideos_max[selectedPoint]["trending_date"]))
            }
            dy={18}
            fontSize={12}
          >
            {"Like vs. Dislike: " +
              usvideos_max[selectedPoint]["likes"] +
              ":" +
              usvideos_max[selectedPoint]["dislikes"]}
          </tspan>
          <tspan
            x={
              30 +
              _scaleX2(parseInt(usvideos_max[selectedPoint]["trending_date"]))
            }
            dy={18}
            fontSize={12}
          >
            {"View: " + usvideos_max[selectedPoint]["view_count"]}
          </tspan>
        </text>
      </g>
    );
  };

  function handleMouseOver(id) {
    var id = id.toString();
    var circle = document.getElementById(id);

    if (circle.getAttribute("opacity") == 0.15) {
      circle.setAttribute("opacity", 1.0);
      circle.setAttribute("stroke", "black");
    } else {
      circle.setAttribute("opacity", 0.15);
      circle.setAttribute("stroke", "white");
    }
  }

  function handleMouseOut(id) {
    var id = id.toString();

    var circle = document.getElementById(id);

    if (circle.getAttribute("opacity") == 0.15) {
      circle.setAttribute("opacity", 1.0);
      circle.setAttribute("stroke", "#808080");
    } else {
      circle.setAttribute("opacity", 0.15);
      circle.setAttribute("stroke", "white");
    }
  }

  function get_unique_Column(name, data) {
    var unique_values = [];
    for (var i = 0; i < data.length; i += 1) {
      if (unique_values.includes(data[i][name]) == false) {
        unique_values.push(data[i][name]);
      }
    }
    return unique_values;
  }

  function reformat_line(line, data) {
    var li = [];
    var init_x = data[line[0]]["view_count"];
    var init_y = data[line[0]]["trending_date"];
    for (var i = 0; i < line.length; i += 1) {      
      li.push([
        parseInt(data[line[i]]["view_count"])-init_x+1,
        parseInt(data[line[i]]["trending_date"])-init_y+1,
      ]);
    }
    return li;
  }
  
  var videos_in_cat = get_unique_Column("video_id", usvideos_full);


  return (
    <div style={{ margin: 10 }}>
      <div
        style={{ display: "flex", alignItems: "center", paddingLeft: "20px" }}
      >
        {/* <img src="src/YouTube-Emblem.png" alt="YouTube logo" height="25px"/> */}
        <h1 style={{ paddingLeft: "20px" }}>
          YouTube Trending Videos | 2021
        </h1>
      </div>
      <div style={{ display: "flex" }}>
        <svg width={1500} height={650}>
          {cats.map((cat, i) => {
            var ids = ids_by_cat[cat];
            return ids.map((id) => {
              return (
                <circle
                  id={id}
                  className={usvideos_max[id]["categoryId"]}
                  cx={_scaleX2(parseInt(usvideos_max[id]["trending_date"]))}
                  cy={_scaleY2(usvideos_max[id]["view_count"])}
                  r={
                    selectedHover == id
                      ? parseInt(
                          usvideos_max[id]["trending_date"] -
                            parseInt(usvideos_max[id]["publishedAt"])
                        ) /
                          2 +
                        2
                      : parseInt(
                          usvideos_max[id]["trending_date"] -
                            parseInt(usvideos_max[id]["publishedAt"])
                        ) / 2
                  }
                  fill={cat_cols[cat]}
                  opacity={
                    selectedPoints.includes(id) || selectedHover == id
                      ? 0.8
                      : 0.15
                  }
                  stroke={
                    selectedPoints.includes(id) || selectedHover == id
                      ? "black"
                      : "white"
                  }
                  onMouseOver={() => {
                    dbsetSelectedHover(id);
                    dbsetSelectedPoint(id);
                  }}
                  onMouseOut={() => {
                    dbsetSelectedHover(null);
                    dbsetSelectedPoint(null);
                  }}
                />
              );
            });
          })}
          {selectedPoint && <HoverText />}
          {/* number of views for each category*/}
          {/* {cats.map((cat, i) => {
            return (
              <text x={1250 - 70} y={43 + i * 23} fontSize={12}>
                {cat_to_t_view[cat]}
              </text>
            );
          })} */}
          {/* color point for each category */}
          {cats.map((cat, i) => {
            return (
              <circle
                id={"cat" + cat}
                // className={cat}
                cx={1250}
                cy={40 + i * 23}
                r={selectedCatHover == "cat" + cat ? 10 : 8}
                fill={cat_cols[cat]}
                opacity={
                  selectedCats.includes(cat) || selectedCatHover == "cat" + cat
                    ? 1.0
                    : 0.15
                }
                stroke={
                  selectedCats.includes(cat) || selectedCatHover == "cat" + cat
                    ? "black"
                    : "white"
                }
                strokeWidth={1.5}
                // onClick={() => clickCircle(cat)}
                onClick={() => {
                  setSelectedCats([cat]);
                  setSelectedPoints(get_index_by_column_value("categoryId", cat, usvideos_max));
                  // console.log(selectedCats)
                  // console.log(cat)
                  // console.log(selectedCats.includes(cat))
                }}
                // onMouseOver={() => handleMouseOver('cat' + cat)}
                // onMouseOut={() => handleMouseOut('cat' + cat)}
                onMouseOver={() => {
                  throttle(setSelectedCatHover("cat" + cat), 200);

                  // console.log(selectedHover)
                  // console.log(id)
                  // console.log(selectedHover==id)
                  // handleMouseOver(id);
                  // setSelectedPoint(id);
                }}
                onMouseOut={() => {
                  throttle(setSelectedCatHover(null), 200);

                  // handleMouseOut(id);
                  // setSelectedPoint(null);
                }}
              />
            );
          })}
          {/* name for each category */}
          {cats.map((cat, i) => {
            return (
              <text x={1250 + 20} y={43 + i * 23} fontSize={12}>
                {cat_id_to_names[cat]}
              </text>
            );
          })}
          {/* axises */}
          <AxisLeft
            strokeWidth={1}
            left={70}
            top={10}
            scale={_scaleY2}
            stroke={"black"}
          />
          <AxisBottom
            strokeWidth={1}
            top={580}
            left={0}
            scale={_scaleDate}
            fontSize={25}
            stroke={"black"}
            // numTicks={11}
          />
          {/* text & labels */}
          <text x={1265} y={13}>
            {" "}
            Category{" "}
          </text>
          <text x={1160} y={13}>
            {" "}
            Total Views{" "}
          </text>
          <text x={1250} y={13}>
            |
          </text>
          <text x={1210} y={580}>
            Days
          </text>
          <text x={30} y={30}>
            Views
          </text>
        </svg>
      </div>
      <div style={{ display: "flex" }}>
        <svg width={1500} height={650}>
          {
          // group_count.map((count) =>{
          //   var end = start + count
          //   var each_cat = usvideos_full.slice(start, end)
          //   start = end + 1
          // cat_cols[cats[vid_trends_ids[0]]]
             videos_in_cat.map((vid, i) => {
              var vid_trends_ids = get_index_by_column_value("video_id", vid, usvideos_full);
              console.log(vid_trends_ids)
              var li_count = reformat_line(vid_trends_ids, usvideos_full);
              // console.log(i, li_count)
              return (
                <path
                  stroke={cat_cols[usvideos_full[vid_trends_ids[0]]['categoryId']]}
                  strokeWidth={1.5}
                  fill={"none"}
                  // opacity={
                  //   selectedCats.includes(cats[i]) || selectedCatHover == "cat" + cats[i]
                  //     ? 1.0
                  //     : 0.15
                  // }
                  // key={city}
                  d={_lineMaker(li_count.sort())}
                />
              );
            // })
          })}
          {/* {selectedPoint && (
            <HoverText styles="z-index:1000; position: fixed; background-color:'red'" />
          )} */}
          {/* number of views for each category*/}
          {/* {cats.map((cat, i) => {
            return (
              <text x={1250 - 70} y={43 + i * 23} fontSize={12}>
                {cat_to_t_view[cat]}
              </text>
            );
          })} */}
          {/* color point for each category */}
          {/* {cats.map((cat, i) => {
            return (
              <circle
                id={"cat" + cat}
                cx={1250}
                cy={40 + i * 23}
                r={selectedCatHover == "cat" + cat ? 10 : 8}
                fill={cat_cols[cat]}
                opacity={
                  selectedCats.includes(cat) || selectedCatHover == "cat" + cat
                    ? 1.0
                    : 0.15
                }
                stroke={
                  selectedCats.includes(cat) || selectedCatHover == "cat" + cat
                    ? "black"
                    : "white"
                }
                strokeWidth={1.5}
                onClick={() => {
                  setSelectedCats([cat]);
                  setSelectedPoints(getIndexByValue("categoryId", cat));
                }}
                onMouseOver={() => {
                  throttle(setSelectedCatHover("cat" + cat), 200);
                }}
                onMouseOut={() => {
                  throttle(setSelectedCatHover(null), 200);
                }}
              />
            );
          })} */}
          {/* name for each category */}
          {/* {cats.map((cat, i) => {
            return (
              <text x={1250 + 20} y={43 + i * 23} fontSize={12}>
                {cat_id_to_names[cat]}
              </text>
            );
          })} */}
          {/* axises */}
          <AxisLeft
            strokeWidth={1}
            left={70}
            top={10}
            scale={_scaleY3}
            stroke={"black"}
          />
          <AxisBottom
            strokeWidth={1}
            top={580}
            left={0}
            scale={_scaleX3}
            fontSize={25}
            stroke={"black"}
            // numTicks={11}
          />
          {/* text & labels */}
          {/* <text x={1265} y={13}>
            {" "}
            Category{" "}
          </text>
          <text x={1160} y={13}>
            {" "}
            Total Views{" "}
          </text>
          <text x={1250} y={13}>
            {" "}
            |{" "}
          </text> */}
          <text x={1210} y={580}>
            {" "}
            Days{" "}
          </text>
          <text x={30} y={30}>
            {" "}
            Views{" "}
          </text>
        </svg>
      </div>

      {/* <h3> About </h3>
      <p> The main viz is a dot plot, plotting the highest number of views for each video trended on Youtube in 2021. 
        The x-axis is the day of the year the video is trending, the y-axis is the number of views, and the size of the circle is the number of days the video trended. 
        The larger the circle, the longer the video trended. 
        Users can select and filter the points by category; hover on each of the points to see some detailed information about the video. 
        Users can also click on the points(video) they are interested in to see more detailed information about the video and trending information. 
      </p>
      <h3> Designs </h3>
      <ul>
        <li> Increase the opacity and the radius of the circle to indicate the circle is clickable. </li>
        <li> Only show the highest number of views in the main plot so that there aren't that many points. Otherwise, it would be too difficult for users to read and interpret.</li>
        <li> Transform the trending information to the size of the circle. The larger the circle, the longer the video trended. </li>
        <li> Make it interactable to filter the points by categories. so it would be easier to see the data and make compression within one category. </li>
        <li> Rank and plot the categories by the total number of views for each category. tells information about with category of videos is the most popular. </li>
        <li> Show some of the info of the video when hovering on the point. I choose to show the title of the video, the channel name, category name, number of views, number of likes, and dislikes. </li>
        <li> And when clicking into the point, the user will be able to see the full trending information, as well as more information about the channel, and other videos in the channel. </li>
        <li> Adding black borders of the points, to make it look better and easier to distinguish with each other. </li>
      </ul>
      <h3>Insights</h3>
      <ul>
        <li>
          The Entertainment category has the most total views of trending videos in 2021.
          The highest viewed video is Turn Into Orbeez from FFuntv, 206 M videos. 
          It is also the second-highest viewed video among all. 
          Entertainment videos usually trend longer than videos from other categories. 
        </li>
        <li>
          The Music category has the second-highest number of total views. The highest played video is Butter from BTS, 264 M. 
          It is even more than all of the number of views of trending videos in the Nonprofit and Activism category. 
          The videos from the music channel do not usually trend for a long time as the Entertainment videos do. 
          The video that trended the longest is Easy on me from Adele, 139 M.
        </li>
        <li> 
        The third-highest number of the total viewed categories is Game. 
          This category does not have an outstandingly high number of views, but the number of trending videos is larger. 
          The highest played video in this category is Money is Plinko Challenge from AnthonySenpai, 72 M. 
        </li>
      </ul>
      <h3> Logistics </h3>
      <p> I spent about 12 hrs on this deliverable. The part that took the most time is to think of the design, 
        try different ideas, and make things working. </p> */}
    </div>
  );
}

export default App;