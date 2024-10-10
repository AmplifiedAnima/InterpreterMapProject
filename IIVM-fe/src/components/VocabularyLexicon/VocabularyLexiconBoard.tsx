import React, { useEffect } from "react";
import {
  GroupedVocabularyType,
  VocabularyItemInterface,
} from "../../interfaces/vocabulary.interface";
import { Button } from "../UI/Button";
import { SavedVocabularyModal } from "./ModalForSavingVocabulary/ModalForSavingVocabulary";
import { useVocabularyMapHook } from "../../utils/useVocabularyMapHook";
import { VocabularyLexiconToolbar } from "./VocabularyLexiconToolbar";
import { NetworkGraph } from "./GraphsComponents/NetworkGraph";
import VocabularyList from "./VocabularyList";
import VocabularyWordDetail from "./VocabularyWordDetail";
import { ToolTipModal } from "../UI/ToolTipModal";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export const VocabularyMapBoard: React.FC<{
  groupedVocabulary: GroupedVocabularyType;
  categoryLabels: string[];
  onCategorySelect: (category: string) => void;
  onWordSelect: (word: VocabularyItemInterface) => void;
  selectedCategory: string | null;
  selectedWord: VocabularyItemInterface | null;
}> = ({
  groupedVocabulary,
  categoryLabels,
  onCategorySelect,
  onWordSelect,
  selectedCategory,
  selectedWord,
}) => {
  const {
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
    scale,
    showSavedVocabularyModal,
    mapRef,
    graphIsOpened,
    position,
    handleZoomIn,
    handleZoomOut,
    handleMapReset,
    setShowSavedVocabularyModal,
    isDragging,
    centerGraph,
    handleMouseDown,
    handleTouchStart,
    handleMouseUpOrTouchEnd,
    setGraphIsOpened,
    handleAddVocabulary,
  } = useVocabularyMapHook();

  const vocabularyItems = useSelector((state: RootState) => state.vocabulary.items);
  const savedVocabularyIds = useSelector((state: RootState) => state.vocabulary.savedVocabularyIds);

  const wordsInCategory: VocabularyItemInterface[] = selectedCategory
    ? Object.values(vocabularyItems).filter(
        (item: VocabularyItemInterface) => item.category === selectedCategory
      )
    : [];

  const selectedWordsInCategory = savedVocabularyIds.filter((id) =>
    wordsInCategory.some((word) => word.id === id)
  );

  const remainingWords =
    wordsInCategory.length - selectedWordsInCategory.length;

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
  }, [setDeviceType]);

  useEffect(() => {
    if (deviceType === "mobile") {
      if (selectedWord) setActiveTab("detail");
      else if (selectedCategory) setActiveTab("list");
      else setActiveTab("categories");
    }
  }, [selectedCategory, selectedWord, deviceType, setActiveTab]);

  const handleSearch = (query: string) => setSearchQuery(query);

  const handleToggleGraph = () => {
    if (selectedCategory && deviceType !== "mobile") {
      setShowGraph(!showGraph);
      setGraphIsOpened(!showGraph);
      centerGraph();
      if (!showGraph) handleMapReset();
    }
  };

  const handleWordSelectInternal = (word: VocabularyItemInterface) => {
    onWordSelect(word);
    if (deviceType === "mobile") setActiveTab("detail");
  };

  const handleGoBackInRwd = () => {
    setActiveTab(selectedCategory ? "list" : "categories");
    onWordSelect(null as unknown as VocabularyItemInterface);
  };

  const renderToolbar = () => (
    <VocabularyLexiconToolbar
      isListModeOpen={activeTab === "list"}
      isOpened={graphIsOpened}
      onZoomIn={handleZoomIn}
      onZoomOut={handleZoomOut}
      onReset={handleMapReset}
      onShowSavedVocabulary={() => setShowSavedVocabularyModal(true)}
      searchQuery={searchQuery}
      setListMode={() =>
        setActiveTab(activeTab === "list" ? "categories" : "list")
      }
      onSearch={handleSearch}
      scale={scale}
      vocabularyList={Object.values(groupedVocabulary)
        .flat()
        .map((item) => item.term)}
      showGraph={showGraph}
      onToggleGraph={handleToggleGraph}
      selectedCategory={selectedCategory}
      setOnToolTipLegendOpen={() => setActiveToolTip((prev) => !prev)}
      onToolTipLegendOpen={activeToolTip}
    />
  );

  const renderCategoryList = () => (
    <div className="flex flex-col items-center justify-center p-4 overflow-y-auto ">
      {categoryLabels.map((category) => (
        <Button
          key={category}
          onClick={() => {
            onCategorySelect(category);
            if (deviceType === "mobile") setActiveTab("list");
          }}
          className={`text-center mb-2 items-center justify-center w-48 ${
            selectedCategory === category
              ? "bg-slate-300 text-white"
              : "text-white"
          } text-xs transition duration-300 ease-in-out hover:bg-slate-200`}
        >
          {category}
        </Button>
      ))}
    </div>
  );

  const renderVocabularyList = () => (
    <div className="overflow-y-auto h-full">
      <VocabularyList
        groupedVocabulary={
          selectedCategory
            ? { [selectedCategory]: groupedVocabulary[selectedCategory] }
            : groupedVocabulary
        }
        searchTerm={searchQuery}
        selectedWord={selectedWord}
        onWordSelect={handleWordSelectInternal}
      />
    </div>
  );
  const renderWordDetail = () => (
    <div className="h-full w-full">
      {selectedWord && (
        <VocabularyWordDetail
          vocabularyItem={selectedWord}
          onAddToSaved={(id: string) => handleAddVocabulary(vocabularyItems[id], () => {})}
          deviceType={deviceType}
          goBackInRwdFunction={
            deviceType === "mobile" || deviceType === "smallTablet"
              ? handleGoBackInRwd
              : undefined
          }
        />
      )}
      {!selectedWord && (
        <VocabularyWordDetail
          vocabularyItem={undefined}
          onAddToSaved={(id: string) => handleAddVocabulary(vocabularyItems[id], () => {})}
          deviceType={deviceType}
          goBackInRwdFunction={
            deviceType === "mobile" || deviceType === "smallTablet"
              ? handleGoBackInRwd
              : undefined
          }
        />
      )}
    </div>
  );

  const renderGraph = () => {
    if (!selectedCategory) {
      return <div>Please select a category to view the graph.</div>;
    }

    return (
      <div
        id="vocabulary-map-board"
        className={`border-2 border-black h-full overflow-hidden relative ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onMouseUp={handleMouseUpOrTouchEnd}
        onTouchEnd={handleMouseUpOrTouchEnd}
        style={{ touchAction: "none" }}
      >
        <ToolTipModal
          showModal={activeToolTip}
          onClose={() => setActiveToolTip(false)}
          children={
            <div className="mx-2">
              <p>
                selected words:{" "}
                <span className="text-[#00FF00] font-bold">
                  {selectedWordsInCategory.length !== 0
                    ? selectedWordsInCategory.length
                    : "NONE"}
                </span>
              </p>
              <p>
                word remaining:{" "}
                <span className="text-[#042f66] font-bold">
                  {remainingWords} / {wordsInCategory.length}
                </span>
              </p>
              <p>
                selected word:{" "}
                <span className="text-[#ff6347] font-bold">
                  {selectedWord?.term ?? "NONE"}
                </span>
              </p>
            </div>
          }
        />
        <div
          ref={mapRef}
          className="w-[200vw] h-[300vh] origin-center"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? "none" : "transform 0.1s ease-out",
          }}
        >
          <NetworkGraph
            category={selectedCategory}
            words={groupedVocabulary[selectedCategory] || []}
            isOpened={true}
            selectedWordId={selectedWord?.id || null}
            searchTerm={searchQuery}
            onWordSelect={onWordSelect}
          />
        </div>
      </div>
    );
  };

  const renderMobileView = () => (
    <div className="flex flex-col h-[90vh]">
      {renderToolbar()}
      <div className="flex space-x-8 justify-center p-2 bg-gray-200">
        <Button
          onClick={() => setActiveTab("categories")}
          className={activeTab === "categories" ? "bg-blue-500 text-white" : ""}
        >
          Categories
        </Button>
        <Button
          onClick={() => setActiveTab("list")}
          className={activeTab === "list" ? "bg-blue-500 text-white" : ""}
        >
          List
        </Button>
        {selectedWord && (
          <Button
            onClick={() => setActiveTab("detail")}
            className={activeTab === "detail" ? "bg-blue-500 text-white" : ""}
          >
            Detail
          </Button>
        )}
      </div>
      <div className="flex-grow overflow-y-auto">
        {activeTab === "categories" && renderCategoryList()}
        {activeTab === "list" && renderVocabularyList()}
        {activeTab === "detail" && renderWordDetail()}
      </div>
    </div>
  );
  const renderSmallTabletView = () => (
    <div className="flex flex-col h-[90vh]">
      {renderToolbar()}
      <div className="flex h-[85vh]">
        <div className="">{renderCategoryList()}</div>
        <div className="w-[100vw] flex flex-col">
          <div className="h-[50vh]">{renderVocabularyList()}</div>
          <div className="h-[35vh] mx-8">{renderWordDetail()}</div>
        </div>
      </div>
    </div>
  );

  const renderLargeTabletView = () => (
    <div className="flex flex-col h-[90vh]">
      {renderToolbar()}
      <div className="flex h-[77vh]">
        <div className="w-1/4 overflow-y-auto">{renderCategoryList()}</div>
        <div className="w-3/4 flex">
          <div className="w-1/2 overflow-y-auto">
            {showGraph ? renderGraph() : renderVocabularyList()}
          </div>
          <div className="w-1/2 overflow-y-auto ">{renderWordDetail()}</div>
        </div>
      </div>
    </div>
  );

  const renderDesktopView = () => (
    <div className="flex flex-col h-[90vh]">
      {renderToolbar()}
      <div className="grid grid-cols-[auto,1fr,1fr] gap-4 h-[80vh]">
        <div className="overflow-y-auto">{renderCategoryList()}</div>
        <div className="overflow-y-auto">
          {showGraph ? renderGraph() : renderVocabularyList()}
        </div>
        <div className="overflow-y-auto">{renderWordDetail()}</div>
      </div>
    </div>
  );
  return (
    <>
      {deviceType === "mobile" && renderMobileView()}
      {deviceType === "smallTablet" && renderSmallTabletView()}
      {deviceType === "largeTablet" && renderLargeTabletView()}
      {deviceType === "desktop" && renderDesktopView()}
      <SavedVocabularyModal
        showModal={showSavedVocabularyModal}
        onClose={() => setShowSavedVocabularyModal(false)}
      />
    </>
  );
};