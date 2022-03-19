import "./App.css";
import { scaleLinear, scaleLog, scaleBand, line } from "d3";
import { throttle } from "lodash";
import { AxisLeft, AxisBottom } from "@visx/axis";
import React, {useState} from "react";

import usvideos_max from "./cleaned_df_max4";
import usvideos_full from "./cleaned_df_full4";

function App() {
  var nf = new Intl.NumberFormat();

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
    29: "#eec6ca"
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

  var videos_in_cat = get_unique_Column("video_id", usvideos_full);
  var all_unique_vids = get_unique_Column("video_id", usvideos_max);

  var [selectedCats, setSelectedCats] = useState(cats);
  var point = null;
  var [selectedPoint, setSelectedPoint] = useState(point);
  var hover = null;
  var [selectedHover, setSelectedHover] = useState(hover);
  var catHover = null;
  var [selectedCatHover, setSelectedCatHover] = useState(catHover);
  var dbsetSelectedPoint = throttle(setSelectedPoint, 200);
  var dbsetSelectedHover = throttle(setSelectedHover, 200);
  var togglegraphval = true;
  var [togglegraph, settogglegraph] = useState(togglegraphval);
  var dbselectedCategory = throttle(setSelectedCatHover, 1000);
  var graph_val = true
  var [graph, setgraph] = useState(graph_val);

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

  const HoverText = () => {
    return (
      <g styles={{ zIndex: 1000, position: "fixed", backgroundColor: "red" }}>
        <rect
          width={250}
          height={110}
          x={
            25 +
            _scaleX2(parseInt(usvideos_max[selectedPoint]["trending_date"]))
          }
          y={_scaleY2(usvideos_max[selectedPoint]["view_count"])}
          rx={5}
          fill="white"
          stroke={"black"}
        ></rect>
        <text
          x={
            35 +
            _scaleX2(parseInt(usvideos_max[selectedPoint]["trending_date"]))
          }
          y={25 + _scaleY2(usvideos_max[selectedPoint]["view_count"])}
        >
          <tspan
            x={
              35 +
              _scaleX2(parseInt(usvideos_max[selectedPoint]["trending_date"]))
            }
          >
            {usvideos_max[selectedPoint]["title"].substring(0, 26) + "..."}
          </tspan>
          <tspan
            x={
              35 +
              _scaleX2(parseInt(usvideos_max[selectedPoint]["trending_date"]))
            }
            dy={20}
            fontSize={12}
          >
            {"Channel: " + usvideos_max[selectedPoint]["channelTitle"]}
          </tspan>
          <tspan
            x={
              35 +
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
              35 +
              _scaleX2(parseInt(usvideos_max[selectedPoint]["trending_date"]))
            }
            dy={18}
            fontSize={12}
          >
            { "Like vs. Dislike: " +
              nf.format(usvideos_max[selectedPoint]["likes"]) +
              ":" +
              nf.format(usvideos_max[selectedPoint]["dislikes"]) }
          </tspan>
          <tspan
            x={
              35 +
              _scaleX2(parseInt(usvideos_max[selectedPoint]["trending_date"]))
            }
            dy={18}
            fontSize={12}
          >
            { "View: " + nf.format(usvideos_max[selectedPoint]["view_count"]) }
          </tspan>
        </text>
      </g>
    );
  };

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
    var init_x = data[line[0]]["view_count"];
    var init_y = data[line[0]]["trending_date"];
    var li = [];
    for (var i = 0; i < line.length; i += 1) {     
      var s = [
        parseInt(data[line[i]]["view_count"])-init_x+1,
        parseInt(data[line[i]]["trending_date"])-init_y+1,
      ]
      li.push(s);
    }
    return li;
  }

  const ids_by_cat = {};
  for (var i = 0; i < usvideos_max.length; i += 1) {
      if (!ids_by_cat[usvideos_max[i]["categoryId"]]) {
        ids_by_cat[usvideos_max[i]["categoryId"]] = [];
      }
      ids_by_cat[usvideos_max[i]["categoryId"]].push(i);
  }

  var index_by_vid = {}
  for (var i=0; i<usvideos_full.length; i += 1) {
    if (!index_by_vid[usvideos_full[i]["video_id"]]) {
      index_by_vid[usvideos_full[i]["video_id"]] = [];
    }
    index_by_vid[usvideos_full[i]["video_id"]].push(i)
  }

  return (
    <div style={{ margin:10}}>
      <div
        style={{ display: "flex", justifyContent:'space-between', alignItem:"center" }}
      >
        {/* <img src="src/YouTube-Emblem.png" alt="YouTube logo" height="25px"/> */}
        <h1 style={{ paddingLeft: "20px" }}>
          YouTube Trending Videos | 2021
        </h1>
        {graph && <h3 style={{ paddingRight:"30px" }} onClick={
          ()=>{
            setgraph(!graph)
          }}
        >
          <a href=""></a>
          About
        </h3>
        }
        {!graph && <h3 style={{ paddingRight:"30px" }} href="#" onClick={
          ()=>{
            setgraph(!graph)
          }}
        >
          <a href=""></a>
          Back
        </h3>
      }
      </div>
      {graph && <div style={{ display: "flex", flexDirection:"column" }}>
        <div style={{ display: "flex" }}>
          {togglegraph ? 
            <div style={{ display: "flex" }}>
              <svg width={1150} height={650}>
                {/* {plot all videos as points} */}
                {all_unique_vids.map((video_id, id) => {
                    return (
                      <circle
                        id={id}
                        className={usvideos_max[id]["categoryId"]}
                        cx={_scaleX2(parseInt(usvideos_max[id]["trending_date"]))}
                        cy={_scaleY2(usvideos_max[id]["view_count"])}
                        r={selectedHover == id ? parseInt(usvideos_max[id]["trending_date"] - parseInt(usvideos_max[id]["publishedAt"])) /
                            2 + 2 : parseInt(usvideos_max[id]["trending_date"] - parseInt(usvideos_max[id]["publishedAt"])) / 2
                        }
                        fill={cat_cols[usvideos_max[id]["categoryId"]]}
                        opacity={
                          selectedCats.includes(parseInt(usvideos_max[id]["categoryId"])) ? 0.8 : 0.15
                        }
                        stroke={
                          selectedCats.includes(parseInt(usvideos_max[id]["categoryId"])) || selectedHover == id ? "black" : "white"
                        }
                        onMouseOver={()=>{
                          throttle(setSelectedPoint(id), 1000);
                          throttle(setSelectedHover(id), 1000);
                        }
                        }
                        onMouseOut={()=>{
                          throttle(setSelectedPoint(null), 1000);
                          throttle(setSelectedHover(null), 1000);
                        }
                        }
                        // onClick
                      />
                    );
                })}
                {selectedPoint && <HoverText />}
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
                />
                {/* text & labels */}
                <text x={1080} y={560}>
                  Days
                </text>
                <text x={30} y={30}>
                  Views
                </text>
              </svg>
            </div>
            : null
          }
          {togglegraph ? null :
            <div style={{ display: "flex" }}>
              <svg width={1150} height={650}>
                {videos_in_cat.map((vid, id) => {
                    var vid_trends_ids = index_by_vid[vid]
                    var li_count = reformat_line(vid_trends_ids, usvideos_full);
                    return (
                      <path
                        id={id}
                        stroke={cat_cols[usvideos_full[vid_trends_ids[0]]['categoryId']]}
                        strokeWidth={1.5}
                        fill={"none"}
                        opacity={
                          selectedCats.includes(parseInt(usvideos_full[vid_trends_ids[0]]['categoryId'])) ? 1.0 : 0.0
                        }
                        d={_lineMaker(li_count)}
                        // onMouseOver={
                        //   console.log(usvideos_full[vid_trends_ids[0]]['video_id'])
                        // }
                      />
                    );
                })}
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
                />
                <text x={1080} y={560}>
                  Days
                </text>
                <text x={30} y={30}>
                  Views
                </text>
              </svg>
            </div>
          }
          <svg width={350} height={650}>
            {/* text & labels */}
            <text x={1265 - 1160} y={33}>
              Category
            </text>
            <text x={0} y={33}>
              Total Views
            </text>
            <text x={1250 - 1160} y={33}>
              |
            </text>
            {/* number of views for each category*/}
            {cats.map((cat, i) => {
              return (
                <text x={0} y={63 + i * 23} fontSize={12}>
                  {cat_to_t_view[cat]}
                </text>
              );
            })}
            {/* color point for each category */}
            {cats.map((cat, i) => {
              return (
                <circle
                  id={"cat" + cat}
                  cx={80}
                  cy={60 + i * 23}
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
                  }}
                  onMouseOver={() => {
                    throttle(setSelectedCatHover("cat" + cat), 1000)
                  }}
                  onMouseOut={() => {
                    throttle(setSelectedCatHover(null), 1000)
                  }}
                />
              );
            })}
            {/* name for each category */}
            {cats.map((cat, i) => {
              return (
                <text x={80 + 20} y={63 + i * 23} fontSize={12}>
                  {cat_id_to_names[cat]}
                </text>
              );
            })}
            <circle
                  // id={"cat" + cat}
                  cx={80}
                  cy={60 + 16 * 23}
                  r={8}
                  fill={"red"}
                  opacity={
                    1.0
                  }
                  stroke={
                    "black"
                  }
                  strokeWidth={1.5}
                  onClick={() => {
                    console.log(cats)
                    setSelectedCats(cats);
                  }}
                />
            <text x={100} y={64 + 16 * 23} fontSize={13}>
              Reset
            </text>
          </svg>
        </div>
        <div style={{ display: "flex", justifyContent:'center' }}>
          <svg>
            <text x={0} y={13} fontSize={13}>
                Dot
              </text>
              <rect style={{ fill:"white", stroke:"black", x:40, y:1, rx:10, width:40, height:20 }}></rect>
              <circle
                    cx={
                      togglegraph ? 50 : 70
                    }
                    cy={11}
                    r={8}
                    fill={"black"}
                    opacity={
                      1.0
                    }
                    strokeWidth={1.5}
                    onClick={() => {
                      settogglegraph(!togglegraph)
                    }}
                  />
              <text x={100} y={13} fontSize={13}>
                Line
              </text>
          </svg>
        </div>
      </div>
      }
      {!graph &&
      <div style={{ display: "flex", flexDirection:"column", padding:25}}>
        <h3> About </h3>
        <p> 
          This visualization shows the videos trended on Youtube in 2021. 
          It contains two plots. 
          One is a dot plot. 
          Each dot represents a video trended in 2021.
          The x-axis is the day of the year the video is trending, 
          the y-axis is the highest number of view for each individual video, 
          and the size of the circle is bases on the number of days the video trended. 
          The larger the circle, the longer the video trended. 
          Another plot is a line plot. 
          The x-axis is the number of days the video trended, 
          and the y-axis is the number of views. 
          You can also select and filter the points by category; 
          hover on each of the points to see some detailed information about the video. 
        </p>
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
      </div>
      }
    </div>
  );
}

export default App;
