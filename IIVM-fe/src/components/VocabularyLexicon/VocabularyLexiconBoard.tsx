import React from "react";
import {
  GroupedVocabularyType,
  VocabularyItemInterface,
} from "../../interfaces/vocabulary.interface";
import { Button } from "../UI/Button";
import { SavedVocabularyModal } from "./ModalForSavingVocabulary/ModalForSavingVocabulary";
import { useVocabularyLexiconHook } from "../../utils/useVocabularyLexiconHook";
import { VocabularyLexiconToolbar } from "./VocabularyLexiconToolbar";
import NetworkGraph from "./GraphsComponents/NetworkGraph";
import VocabularyList from "./VocabularyList";
import VocabularyWordDetail from "./VocabularyWordDetail";
import { ToolTipModal } from "../UI/ToolTipModal";
import { CheckCircle, PlusCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { motion, AnimatePresence } from "framer-motion";

export const VocabularyLexicon: React.FC<{
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
    activeTab,
    setActiveTab,
    activeToolTip,
    setActiveToolTip,
    searchQuery,
    handleSearch,
    showGraph,
    setShowGraph,
    showSavedVocabularyModal,
    graphIsOpened,
    setIsGraphFullScreen,
    setShowSavedVocabularyModal,
    handleToggleGraph,
    setGraphIsOpened,
    handleAddVocabulary,

    isGraphFullScreen,

    isGraphRendered,
  } = useVocabularyLexiconHook();

  const vocabularyItems = useSelector(
    (state: RootState) => state.vocabulary.items
  );
  const savedVocabularyIds = useSelector(
    (state: RootState) => state.vocabulary.savedVocabularyIds
  );

  const wordsInCategory: VocabularyItemInterface[] = selectedCategory
    ? Object.values(vocabularyItems).filter(
        (item: VocabularyItemInterface) => item.category === selectedCategory
      )
    : [];

  const remainingWordsInCategory = wordsInCategory.filter(
    (word) => !savedVocabularyIds.includes(word.id)
  );

  const remainingWordsCount = remainingWordsInCategory.length;

  const handleWordSelectInternal = (word: VocabularyItemInterface) => {
    onWordSelect(word);
    if (deviceType === "mobile") setActiveTab("detail");
  };

  const handleGoBackInRwd = () => {
    setActiveTab(selectedCategory ? "list" : "categories");
    onWordSelect(null as unknown as VocabularyItemInterface);
  };

  const handleExitFullScreenGraph = () => {
    setIsGraphFullScreen(false);
    setShowGraph(false);
    setGraphIsOpened(false);
  };

  const renderToolbar = () => (
    <VocabularyLexiconToolbar
      isListModeOpen={activeTab === "list"}
      isOpened={graphIsOpened}
      onShowSavedVocabulary={() => setShowSavedVocabularyModal(true)}
      searchQuery={searchQuery}
      setListMode={() =>
        setActiveTab(activeTab === "list" ? "categories" : "list")
      }
      onSearch={handleSearch}
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
    <div className="flex flex-col items-center justify-center p-1 m-4 overflow-y-auto ">
      {categoryLabels.map((category) => (
        <Button
          key={category}
          onClick={() => {
            onCategorySelect(category);
            if (deviceType === "mobile") setActiveTab("list");
          }}
          className={`${
            (deviceType === "desktop" && "w-56") ||
            (deviceType === "largeTablet" && "w-56") ||
            (deviceType === "smallTablet" && "w-56") ||
            (deviceType === "mobile" && "w-72")
          } ${
            selectedCategory === category
              ? "bg-[#555585] text-white"
              : "text-white"
          } my-1 justify-start text-sm text-white hover:bg-[#8b8ad6] transition-colors duration-200 font-sans font-medium tracking-wide`}
        >
          {category.toUpperCase()}
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
          onAddToSaved={(id: string) =>
            handleAddVocabulary(vocabularyItems[id], () => {})
          }
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
          onAddToSaved={(id: string) =>
            handleAddVocabulary(vocabularyItems[id], () => {})
          }
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
    const vocabularyArray = Object.values(vocabularyItems);

    const buttonVariants = {
      hover: { scale: 1.1 },
      tap: { scale: 0.95 },
    };

    const wordVariants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    };

    return (
      <div
        id="vocabulary-map-board"
        className="border-2 border-black h-full overflow-hidden relative"
      >
        {isGraphFullScreen && (
          <Button
            onClick={handleExitFullScreenGraph}
            className="absolute top-4 right-4 z-10"
          >
            Exit
          </Button>
        )}
        <div className="absolute top-4 left-4 z-10">
          <ToolTipModal
            showModal={activeToolTip}
            onClose={() => setActiveToolTip(false)}
          >
            <div className="space-y-4 pt-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Selected words:</span>
                <motion.span
                  className="font-semibold text-indigo-600"
                  key={savedVocabularyIds.length}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  {savedVocabularyIds.length}
                </motion.span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Words remaining:</span>
                <motion.span
                  className="font-semibold text-indigo-600"
                  key={remainingWordsCount}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  {remainingWordsCount} / {wordsInCategory.length}
                </motion.span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Selected word:</span>
                  {selectedWord && (
                    <motion.button
                      onClick={() =>
                        handleAddVocabulary(selectedWord, () => {})
                      }
                      className="ml-2 p-1 rounded-full"
                      disabled={savedVocabularyIds.includes(selectedWord.id)}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      {savedVocabularyIds.includes(selectedWord.id) ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <PlusCircle className="w-6 h-6 text-blue-500" />
                      )}
                    </motion.button>
                  )}
                </div>
                <AnimatePresence mode="wait">
                  {selectedWord ? (
                    <motion.div
                      key={selectedWord.id}
                      className="font-semibold text-orange-400 break-words"
                      variants={wordVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      {selectedWord.term}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="none"
                      className="font-semibold text-gray-400"
                      variants={wordVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      NONE
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </ToolTipModal>
        </div>
        {(isGraphRendered || showGraph) && (
          <NetworkGraph
            vocabulary={vocabularyArray}
            isOpened={graphIsOpened}
            selectedWordId={selectedWord?.id || null}
            searchTerm={searchQuery}
            onWordSelect={handleWordSelectInternal}
            selectedCategory={selectedCategory}
          />
        )}
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

  const renderTabletView = () => (
    <div className="flex flex-col h-[90vh]">
      {renderToolbar()}
      {isGraphFullScreen ? (
        renderGraph()
      ) : (
        <div className="flex h-[85vh]">
          <div
            className={`${
              (deviceType === "smallTablet" && "w-1/3") ||
              (deviceType === "largeTablet" && "w-1/4")
            } overflow-y-auto mr-2`}
          >
            {renderCategoryList()}
          </div>
          <div className="w-3/4 flex">
            <div className="w-1/2 overflow-y-auto">
              {showGraph ? renderGraph() : renderVocabularyList()}
            </div>
            <div className="w-1/2 overflow-y-auto ">{renderWordDetail()}</div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDesktopView = () => (
    <div className="flex flex-col h-[90vh]">
      {renderToolbar()}
      {isGraphFullScreen ? (
        renderGraph()
      ) : (
        <div className="grid grid-cols-[auto,1fr,1fr] gap-4 h-[80vh]">
          <div className="overflow-y-auto">{renderCategoryList()}</div>
          <div className="overflow-y-auto">
            {showGraph ? renderGraph() : renderVocabularyList()}
          </div>
          <div className="overflow-y-auto">{renderWordDetail()}</div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {deviceType === "mobile" && renderMobileView()}
      {(deviceType === "smallTablet" || deviceType === "largeTablet") &&
        renderTabletView()}
      {deviceType === "desktop" && renderDesktopView()}
      <SavedVocabularyModal
        showModal={showSavedVocabularyModal}
        onClose={() => setShowSavedVocabularyModal(false)}
      />
    </>
  );
};
