import { useState, useRef, useEffect } from "react";
import { VocabularyItemInterface } from "../interfaces/vocabulary.interface";
import { useDispatch } from "react-redux";
import { saveVocabularyForUser } from "../redux/vocabulary/vocabularyThunks";
import { AppDispatch } from "../redux/store";

export const useVocabularyMapHook = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [graphIsOpened, setGraphIsOpened] = useState(false);

  const baseScale = 0.4; // Increased base scale for better visibility
  const defaultPosition = { x: -1400, y: -1000 }; // Start at center

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(defaultPosition);
  const [startPosition, setStartPosition] = useState(defaultPosition);

  const [showSavedVocabularyModal, setShowSavedVocabularyModal] =
    useState(false);
  const [showVocabularyDetailsModal, setShowVocabularyDetailsModal] =
    useState(false);
  const [showModalOfDetailsOnMap, setShowModalOfDetailsOnMap] = useState(false);
  const [selectedWord, setSelectedWord] = useState<
    VocabularyItemInterface | undefined
  >(undefined);

  const [deviceType, setDeviceType] = useState<
    "mobile" | "largeTablet" | "smallTablet" | "desktop"
  >("desktop");
  const [activeTab, setActiveTab] = useState<"categories" | "list" | "detail">(
    "categories"
  );
  const [activeToolTip, setActiveToolTip] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showGraph, setShowGraph] = useState(false);

  const [mapWidth, setMapWidth] = useState(0);
  const [mapHeight, setMapHeight] = useState(0);
  const [scale, setScale] = useState(baseScale);

  // const savedVocabulary = useSelector((state: RootState) => state.vocabulary.savedVocabularyToLearn);
  const dispatch = useDispatch<AppDispatch>();

  // Calculate map dimensions
  const calculateMapDimensions = () => {
    if (mapRef.current) {
      const { width, height } = mapRef.current.getBoundingClientRect();
      setMapWidth(width);
      setMapHeight(height);
    }
    console.log(`width ${mapWidth}`, `mapHeight ${mapHeight}`);
  };

  // Center the graph
  const centerGraph = () => {
    if (mapRef.current) {
      // const { width, height } = mapRef.current.getBoundingClientRect();
      setPosition(defaultPosition);
      setScale(0.2);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const touch = e.touches[0];
    setStartPosition({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
  };

  const handleMouseUpOrTouchEnd = () => {
    setIsDragging(false);
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;

    const newX = clientX - startPosition.x;
    const newY = clientY - startPosition.y;

    setPosition({ x: newX, y: newY });
  };

  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    handleMove(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };
  const handleZoomIn = () => {
    setScale((prevScale) => {
      const newScale = prevScale * 1.2;
      console.log("Zooming in. New scale:", newScale);
      return Math.min(newScale, 2);
    });
  };

  const handleZoomOut = () => {
    setScale((prevScale) => {
      const newScale = prevScale / 1.2;
      console.log("Zooming out. New scale:", newScale);
      return Math.max(newScale, 0.2);
    });
  };
  const handleMapReset = () => {
    setScale(baseScale);
    centerGraph();
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUpOrTouchEnd);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleMouseUpOrTouchEnd);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUpOrTouchEnd);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleMouseUpOrTouchEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUpOrTouchEnd);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleMouseUpOrTouchEnd);
    };
  }, [isDragging]);

  const handleAddVocabulary = (
    vocabularyWord: VocabularyItemInterface,
    onClose?: () => void
  ) => {
    dispatch(saveVocabularyForUser([vocabularyWord.id]));
    if (onClose) {
      onClose();
    }
  };

  const handleCardClick = (vocabularyWord: VocabularyItemInterface) => {
    setSelectedWord(vocabularyWord);
    setShowVocabularyDetailsModal(true);
  };
  const handleToggleGraph = () => {
    if (selectedCategory && deviceType !== "mobile") {
      setShowGraph(!showGraph);
      setGraphIsOpened(!showGraph);
      centerGraph();
      if (!showGraph) handleMapReset();
    }
  };
  return {
    defaultPosition,
    isDragging,
    position,
    scale,
    mapRef,
    showSavedVocabularyModal,
    showVocabularyDetailsModal,
    showModalOfDetailsOnMap,
    selectedWord,
    showToolbar,
    selectedCategory,
    graphIsOpened,
    deviceType,
    setDeviceType,
    activeTab,
    setActiveTab,
    activeToolTip,
    setActiveToolTip,
    searchQuery,
    setSearchQuery,
    showGraph,

    setShowGraph,
    handleMouseDown,
    handleTouchStart,
    handleMouseUpOrTouchEnd,
    handleZoomIn,
    handleZoomOut,
    handleMapReset,
    handleCardClick,
    handleToggleGraph,
    setShowSavedVocabularyModal,
    setShowVocabularyDetailsModal,
    setShowToolbar,
    setSelectedWord,
    setSelectedCategory,
    setGraphIsOpened,
    setPosition,
    handleAddVocabulary,
    calculateMapDimensions,
    centerGraph,
    setShowModalOfDetailsOnMap,
  };
};
