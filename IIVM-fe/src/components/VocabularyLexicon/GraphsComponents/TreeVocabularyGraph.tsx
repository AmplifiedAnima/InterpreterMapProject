import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

// Define the TreeNode structure
interface TreeNode {
  id: string;
  group: string;
  label: string;
  children?: TreeNode[];
}

// TreeVocabularyGraph component
export const TreeVocabularyGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const width = 1400;
  const height = 1200;
  const margin = { top: 80, right: 200, bottom: 20, left: 200 };

  useEffect(() => {
    if (!svgRef.current) return;

    // Define the grammar tenses tree structure
    const rootNode: TreeNode = {
      id: "tenses",
      group: "category",
      label: "Tenses",
      children: [
        {
          id: "present",
          group: "tense",
          label: "Present Tenses",
          children: [
            { id: "present_simple", group: "subtense", label: "Present Simple" },
            { id: "present_continuous", group: "subtense", label: "Present Continuous" },
            { id: "present_perfect", group: "subtense", label: "Present Perfect" },
            { id: "present_perfect_continuous", group: "subtense", label: "Present Perfect Continuous" },
          ],
        },
        {
          id: "past",
          group: "tense",
          label: "Past Tenses",
          children: [
            { id: "past_simple", group: "subtense", label: "Past Simple" },
            { id: "past_continuous", group: "subtense", label: "Past Continuous" },
            { id: "past_perfect", group: "subtense", label: "Past Perfect" },
            { id: "past_perfect_continuous", group: "subtense", label: "Past Perfect Continuous" },
          ],
        },
        {
          id: "future",
          group: "tense",
          label: "Future Tenses",
          children: [
            { id: "future_simple", group: "subtense", label: "Future Simple" },
            { id: "future_continuous", group: "subtense", label: "Future Continuous" },
            { id: "future_perfect", group: "subtense", label: "Future Perfect" },
            { id: "future_perfect_continuous", group: "subtense", label: "Future Perfect Continuous" },
          ],
        },
      ],
    };

    // Set up SVG dimensions and viewBox
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    // Create a tree layout
    const treeLayout = d3
      .tree<TreeNode>()
      .size([height - margin.top - margin.bottom, width - margin.left - margin.right]);

    // Define root node as a hierarchy
    const root = d3.hierarchy(rootNode);

    // Generate tree data
    const treeData = treeLayout(root);

    // Create links between nodes
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-width", "3px")
      .selectAll("path")
      .data(treeData.links())
      .enter()
      .append("path")
      .attr("d", (d) => {
        const { source, target } = d;
        return `
          M${source.y},${source.x}
          C${source.y + 50},${source.x}
           ${target.y - 50},${target.x}
           ${target.y},${target.x}
        `;
      });

    // Create nodes
    const node = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .selectAll("g")
      .data(treeData.descendants())
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.y},${d.x})`);

    // Append circles to nodes
    node
      .append("circle")
      .attr("r", 5)
      .attr("fill", (d) =>
        d.data.group === "category" ? "#ff0000" : d.data.group === "tense" ? "#00ff00" : "#0000ff"
      );

    // Append text labels to nodes
    node
      .append("text")
      .attr("dy", 10)
      .attr("x", (d) => (d.children ? -20 : 20))
      .style("text-anchor", (d) => (d.children ? "end" : "start"))
      .text((d) => d.data.label)
      .attr("font-size", 20);

    // Cleanup when the component unmounts
    return () => {
      svg.selectAll("*").remove();
    };
  }, []);

  return (
    <div>
      <h3>ENGLISH GRAMMAR TENSES</h3>
      <svg ref={svgRef} />
    </div>
  );
};
