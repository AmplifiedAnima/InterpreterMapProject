import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { VocabularyItemInterface } from "../../../interfaces/vocabulary.interface";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";

interface NetworkGraphProps {
  category: string;
  words: VocabularyItemInterface[];
  isOpened: boolean;
  selectedWordId?: string | null;
  searchTerm?: string;
  onWordSelect: (word: VocabularyItemInterface) => void;
}

interface NodeData extends d3.SimulationNodeDatum {
  id: string;
  group: string;
  label?: string;
  word?: VocabularyItemInterface;
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({
  category,
  words,
  isOpened,
  selectedWordId,
  searchTerm,
  onWordSelect,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 2000 });

  const savedVocabularyIds = useSelector(
    (state: RootState) => state.vocabulary.savedVocabularyIds
  );

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const { width, height } = svgRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    window.addEventListener("resize", updateDimensions);
    updateDimensions();

    return () => window.removeEventListener("resize", updateDimensions);
  }, [isOpened]);

  useEffect(() => {
    if (!svgRef.current || !words) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;

    const nodes: NodeData[] = [
      { id: category, group: "category" },
      ...words.map((word) => ({
        id: word.id,
        group: "word",
        label: word.term,
        word: word,
      })),
    ];

    const links = words.map((word) => ({ source: category, target: word.id }));

    const color = "#a09edd";
    const highlightColor = "#ff6347";
    const onSavedColor = "#00FF00";
    const searchHighlightColor = "#00ff00";

    const size = d3
      .scaleOrdinal<string, number>()
      .domain(["category", "word"])
      .range([20, 10]);

    const radius = Math.min(width, height) * 0.7; // Increased from 0.6 to 0.7

    const simulation = d3
      .forceSimulation<NodeData>(nodes)
      .force(
        "link",
        d3
          .forceLink<NodeData, d3.SimulationLinkDatum<NodeData>>(links)
          .id((d) => d.id)
          .distance(radius * 0.5) // Increased from 0.4 to 0.5
      )
      .force("charge", d3.forceManyBody().strength(-1800)) // Increased from -1200 to -1800
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide<NodeData>().radius((d) => size(d.group) * 2.5) // Increased from 2 to 2.5
      );

    const link = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#b9bbe8")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1);

    const node = svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d) => size(d.group))
      .attr("fill", (d) => {
        if (selectedWordId && d.id === selectedWordId) return highlightColor;
        if (
          searchTerm &&
          d.label &&
          d.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
          return searchHighlightColor;
        if (savedVocabularyIds.includes(d.id)) return onSavedColor;
        return color;
      })
      .on("click", (event, d) => {
        if (d.group === "word" && d.word) {
          onWordSelect(d.word);
        }
      })
      .style("cursor", "pointer");

    const label = svg
      .append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text((d) => d.label || d.id)
      .attr("font-size", (d) => (d.group === "category" ? 16 : 12))
      .attr("font-weight", "bold")
      .attr("dx", (d) => (d.group === "category" ? 0 : 12))
      .attr("dy", (d) => (d.group === "category" ? -25 : 4))
      .attr("text-anchor", (d) => (d.group === "category" ? "middle" : "start"))
      .attr("fill", "#4B5563")
      .style("opacity", isOpened ? 1 : 0);

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as unknown as NodeData).x ?? 0)
        .attr("y1", (d) => (d.source as unknown as NodeData).y ?? 0)
        .attr("x2", (d) => (d.target as unknown as NodeData).x ?? 0)
        .attr("y2", (d) => (d.target as unknown as NodeData).y ?? 0);

      node.attr("cx", (d) => d.x ?? 0).attr("cy", (d) => d.y ?? 0);

      label.attr("x", (d) => d.x ?? 0).attr("y", (d) => d.y ?? 0);
    });

    if (isOpened) {
      label.transition().duration(500).style("opacity", 1);
    } else {
      label.transition().duration(500).style("opacity", 0);
    }

    return () => {
      simulation.stop();
    };
  }, [words,selectedWordId]);

  return (
    <svg
      ref={svgRef}
      width="200%"
      height="200%"
      className="transition-all"
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      preserveAspectRatio="xMidYMid meet"
    />
  );
};
