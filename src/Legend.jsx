import "./App.css";
import { scaleLinear, scaleLog, scaleBand, line } from "d3";
import { throttle } from "lodash";
import { AxisLeft, AxisBottom } from "@visx/axis";
import React, {useState, useCallback} from "react";

import usvideos_max from "./cleaned_df_max4";
import usvideos_full from "./cleaned_df_full4";



function Legend(){
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
    var all_unique_vids = get_unique_Column("video_id", usvideos_max)

    var selected_category_val = []
    var {selected_category, set_selected_category} = useState(selected_category_val)
  
    return (
        <svg width={350} height={650}>
        {/* number of views for each category*/}
        {cats.map((cat, i) => {
          return (
            <text x={0} y={43 + i * 23} fontSize={12}>
              {cat_to_t_view[cat]}
            </text>
          );
        })}
        {/* color point for each category */}
        {cats.map((cat, i) => {
          return (
            <circle
              id={"cat" + cat}
              // className={cat}
              cx={80}
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
                setSelectedPoints(get_index_by_column_value("categoryId", cat, usvideos_max));
              }}
              onMouseOver={() => {
                throttle(setSelectedCatHover("cat" + cat), 200);
              }}
              onMouseOut={() => {
                throttle(setSelectedCatHover(null), 200);
              }}
            />
          );
        })}
        {/* name for each category */}
        {cats.map((cat, i) => {
          return (
            <text x={80 + 20} y={43 + i * 23} fontSize={12}>
              {cat_id_to_names[cat]}
            </text>
          );
        })}
        {/* text & labels */}
        <text x={1265 - 1160} y={13}>
          Category
        </text>
        <text x={0} y={13}>
          Total Views
        </text>
        <text x={1250 - 1160} y={13}>
          |
        </text>
      </svg>
    )
}

export default Legend;