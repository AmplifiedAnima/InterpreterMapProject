import React, {
  useRef,
  useLayoutEffect,
  useState,
  useCallback,
  memo,
  useMemo,
  useEffect,
} from "react";
import * as d3 from "d3";
import { VocabularyItemInterface } from "../../../interfaces/vocabulary.interface";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";

interface NetworkGraphProps {
  vocabulary: VocabularyItemInterface[];
  isOpened: boolean;
  selectedWordId?: string | null;
  searchTerm?: string;
  selectedCategory: string | null;
  onWordSelect: (word: VocabularyItemInterface) => void;
}

interface NodeData extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  word?: VocabularyItemInterface;
  category: string;
  type: "word" | "category";
}

interface LinkData extends d3.SimulationLinkDatum<NodeData> {
  source: NodeData;
  target: NodeData;
}

const NetworkGraph: React.FC<NetworkGraphProps> = memo(
  ({
    vocabulary,
    isOpened,
    selectedWordId,
    searchTerm,
    selectedCategory,
    onWordSelect,
  }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const gRef = useRef<SVGGElement>(null);
    const [dimensions, setDimensions] = useState<{
      width: number;
      height: number;
    }>({ width: 2000, height: 2000 });

    const savedVocabularyIds = useSelector(
      (state: RootState) => state.vocabulary.savedVocabularyIds
    );
    const [isInitialized, setIsInitialized] = useState(false);
    const INITIAL_ZOOM_SCALE = 0.3;

    useLayoutEffect(() => {
      if (svgRef.current) {
        const { width, height } = svgRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(width, 2000),
          height: Math.max(height, 2000),
        });
      }
    }, []);

    const nodes: NodeData[] = useMemo(() => {
      if (selectedCategory) {
        const categoryNodes: NodeData[] = [
          {
            id: selectedCategory,
            label: selectedCategory,
            category: selectedCategory,
            type: "category",
          },
        ];

        const wordNodes: NodeData[] = vocabulary
          .filter((word) => word.category === selectedCategory)
          .map((word) => ({
            id: word.id,
            label: word.term,
            word: word,
            category: word.category,
            type: "word",
          }));

        return [...categoryNodes, ...wordNodes];
      } else {
        return [];
      }
    }, [vocabulary, selectedCategory]);

    const links: LinkData[] = useMemo(() => {
      if (selectedCategory) {
        return nodes
          .filter((node) => node.type === "word")
          .map((word) => ({
            source: word,
            target: nodes.find((n) => n.id === word.category)!,
          }));
      } else {
        return [];
      }
    }, [nodes, selectedCategory]);

    const initializeGraph = useCallback(() => {
      if (
        !svgRef.current ||
        !gRef.current ||
        !vocabulary.length ||
        !selectedCategory ||
        isInitialized
      )
        return;

      const svg = d3.select(svgRef.current);
      const g = d3.select(gRef.current);

      g.selectAll("*").remove();

      const { width, height } = dimensions;

      const baseColor = "#a09edd";
      const highlightColor = "#ff6347";
      const onSavedColor = "#00FF00";
      const searchHighlightColor = "#00FFFF";

      const simulation = d3
        .forceSimulation<NodeData>(nodes)
        .force(
          "link",
          d3
            .forceLink<NodeData, LinkData>(links)
            .id((d) => d.id)
            .distance((d) =>
              d.source.type === "category" && d.target.type === "category"
                ? 50000
                : 10000
            )
        )
        .force(
          "charge",
          d3
            .forceManyBody<NodeData>()
            .strength((d) => (d.type === "category" ? 0 : 200))
        )
        .force(
          "center",
          d3.forceCenter(
            width / (2 * INITIAL_ZOOM_SCALE),
            height / (2 * INITIAL_ZOOM_SCALE)
          )
        )
        .force(
          "collision",
          d3
            .forceCollide<NodeData>()
            .radius((d) => (d.type === "category" ? 300 : 1200))
        );

      const link = g
        .append("g")
        .selectAll<SVGLineElement, LinkData>("line")
        .data(links)
        .join("line")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", (d) =>
          d.source.type === "category" && d.target.type === "category" ? 3 : 2
        );

      const nodeGroup = g
        .append("g")
        .selectAll<SVGGElement, NodeData>("g")
        .data(nodes)
        .join("g");

      nodeGroup
        .append("circle")
        .attr("r", (d) => (d.type === "category" ? 550 : 450))
        .attr("fill", (d: NodeData) => {
          if (selectedWordId && d.id === selectedWordId) return highlightColor;
          if (
            searchTerm &&
            d.label.toLowerCase().includes(searchTerm.toLowerCase())
          )
            return searchHighlightColor;
          if (savedVocabularyIds.includes(d.id)) return onSavedColor;
          return baseColor;
        })
        .on("click", (event: MouseEvent, d: NodeData) => {
          if (d.type === "word" && d.word) onWordSelect(d.word);
        });

      nodeGroup
        .append("text")
        .text((d) => d.label)
        .attr("font-size", (d) => (d.type === "category" ? 400 : 200))
        .attr("dy", (d) => (d.type === "category" ? 70 : 7))
        .attr("text-anchor", "middle")
        .attr("fill", "#000000")
        .style("font-weight", "bold")
        .style("pointer-events", "none");

      simulation.on("tick", () => {
        link
          .attr("x1", (d) => d.source.x!)
          .attr("y1", (d) => d.source.y!)
          .attr("x2", (d) => d.target.x!)
          .attr("y2", (d) => d.target.y!);

        nodeGroup.attr("transform", (d) => `translate(${d.x},${d.y})`);
      });

      simulation.tick(50);

      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 10])
        .on("zoom", (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
          g.attr("transform", event.transform.toString());
        });

      svg.call(zoom);
      svg.on("dblclick.zoom", null);

      // Set initial transform
      const initialTransform = d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(INITIAL_ZOOM_SCALE)
        .translate(-width / 2, -height / 2);

      svg.call(zoom.transform, initialTransform);
      svg.call(zoom);
      svg.on("dblclick.zoom", null);

      setIsInitialized(true);

      return () => {
        simulation.stop();
      };
    }, [
      vocabulary,
      dimensions,
      isOpened,
      selectedWordId,
      searchTerm,
      selectedCategory,
      savedVocabularyIds,
      onWordSelect,
      INITIAL_ZOOM_SCALE,
      nodes,
      links,
    ]);

    useEffect(() => {
      initializeGraph();
    }, [initializeGraph]);

    useEffect(() => {
      if (isInitialized && gRef.current) {
        const g = d3.select(gRef.current);
        const baseColor = "#a09edd";
        const highlightColor = "#ff6347";
        const onSavedColor = "#00FF00";
        const searchHighlightColor = "#00FFFF";

        g.selectAll<SVGCircleElement, NodeData>("circle").attr(
          "fill",
          (d: NodeData) => {
            if (selectedWordId && d.id === selectedWordId)
              return highlightColor;
            if (
              searchTerm &&
              d.label.toLowerCase().includes(searchTerm.toLowerCase())
            )
              return searchHighlightColor;
            if (savedVocabularyIds.includes(d.id)) return onSavedColor;
            return baseColor;
          }
        );
      }
    }, [isInitialized, selectedWordId, searchTerm, savedVocabularyIds]);

    return (
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <g ref={gRef} />
      </svg>
    );
  }
);

export default NetworkGraph;
