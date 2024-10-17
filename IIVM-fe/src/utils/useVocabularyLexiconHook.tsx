import { useState, useRef, useEffect } from "react";
import { VocabularyItemInterface } from "../interfaces/vocabulary.interface";
import { useDispatch, } from "react-redux";
import { saveVocabularyForUser } from "../redux/vocabulary/vocabularyThunks";
import { AppDispatch, } from "../redux/store";

export const useVocabularyLexiconHook = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [graphIsOpened, setGraphIsOpened] = useState(false);

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

  const dispatch = useDispatch<AppDispatch>();

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

  const [isGraphRendered, setIsGraphRendered] = useState(false);
  const [isGraphFullScreen, setIsGraphFullScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setDeviceType("mobile");
      } else if (window.innerWidth <= 960) {
        setDeviceType("smallTablet");
      } else if (window.innerWidth <= 1024) {
        setDeviceType("largeTablet");
      } else {
        setDeviceType("desktop");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (deviceType === "mobile") {
      if (selectedWord) setActiveTab("detail");
      else if (selectedCategory) setActiveTab("list");
      else setActiveTab("categories");
    }
  }, [selectedCategory, selectedWord, deviceType]);

  const handleSearch = (query: string) => setSearchQuery(query);

  const handleToggleGraph = () => {
    if (deviceType !== "mobile") {
      setShowGraph(!showGraph);
      setGraphIsOpened(!showGraph);
      setIsGraphFullScreen(!showGraph);
      if (!showGraph) {
        setIsGraphRendered(true);
      }
    }
  };

  const handleWordSelectInternal = (word: VocabularyItemInterface) => {
    setSelectedWord(word);
    if (deviceType === "mobile") setActiveTab("detail");
  };

  const handleGoBackInRwd = () => {
    setActiveTab(selectedCategory ? "list" : "categories");
    setSelectedWord(undefined);
  };

  const handleExitFullScreenGraph = () => {
    setIsGraphFullScreen(false);
    setShowGraph(false);
    setGraphIsOpened(false);
  };

  return {
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
    handleCardClick,
    handleToggleGraph,
    setShowSavedVocabularyModal,
    setShowVocabularyDetailsModal,
    setShowToolbar,
    setSelectedWord,
    setSelectedCategory,
    setGraphIsOpened,
    handleAddVocabulary,
    setShowModalOfDetailsOnMap,
    isGraphRendered,
    setIsGraphRendered,
    isGraphFullScreen,
    setIsGraphFullScreen,

    handleSearch,
    handleWordSelectInternal,
    handleGoBackInRwd,
    handleExitFullScreenGraph,
  };
};
