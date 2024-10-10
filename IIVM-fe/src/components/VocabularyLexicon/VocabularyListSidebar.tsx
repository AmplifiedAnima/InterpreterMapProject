// import React, { useState } from "react";
// import { VocabularyItemInterface } from "../../interfaces/vocabulary.interface";
// import { Button } from "../UI/Button";
// import arrowDown from "../../assets/icons/arrow-down-circle.svg";
// import arrowRight from "../../assets/icons/arrow-right-circle.svg";
// interface VocabularyListProps {
//   filteredVocabulary: VocabularyItemInterface[];
//   groupedVocabulary: Record<string, VocabularyItemInterface[]>;
//   category: string;
//   handleShowTooltip: (
//     e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
//     vocabularyItem: VocabularyItemInterface
//   ) => void;
// }

// const VocabularyItem: React.FC<{
//   item: VocabularyItemInterface;
//   onClick: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
// }> = ({ item, onClick }) => (
//   <li className="border-b border-gray-300 bg-white flex px-4 py-2 hover:bg-gray-100 ">
//     <div
//       className="text-md text-gray-800 w-1/2 cursor-pointer"
//       onClick={onClick}
//     >
//       {item.term}
//     </div>
//     <div className="text-md text-purple-700 w-1/2 text-left">
//       {Object.values(item.primary_translations).join(", ")}
//     </div>
//   </li>
// );

// const VocabularyListSidebar: React.FC<VocabularyListProps> = ({
//   filteredVocabulary,
//   groupedVocabulary,
//   category,
//   handleShowTooltip,
// }) => {
//   const isMobile = window.innerWidth <= 768;
//   const [isOpen, setIsOpen] = useState(false);
//   const vocabularyToDisplay =
//     filteredVocabulary.length > 0
//       ? filteredVocabulary
//       : groupedVocabulary[category];

//   const toggleList = () => setIsOpen(!isOpen);

//   return (
//     <div className=" flex flex-col">
//       <Button
//         onClick={toggleList}
//         className="flex items-center bg-[#b9bbe8] rounded-none w-full"
//       >
//         {isMobile ? (
//           <span className="px-1"> List</span>
//         ) : (
//           <span className="px-2">Vocabulary List</span>
//         )}

//         {isOpen ? <img src={arrowRight} /> : <img src={arrowDown} />}
//       </Button>
//       {isOpen && (
//         <div className=" border border-gray-300 shadow-md bg-[#b9bbe8]">
//           <div className="bg-gray-100 border-b border-gray-300 flex py-2 px-4 font-semibold">
//             <div className="text-purple-600 w-1/2">Word</div>
//             <div className="text-gray-700 w-1/2 text-left">Translation</div>
//           </div>
//           <ul className="max-h-[78vh] overflow-y-scroll overflow-x-hidden h-[72.5vh] w-[97.7vw] lg:w-[97.7vw] xl:w-[40vw] md:w-[50vw] bg-white  whitespace-nowrap">
//             {vocabularyToDisplay.map((item) => (
//               <VocabularyItem
//                 key={item.id}
//                 item={item}
//                 onClick={(e) => handleShowTooltip(e, item)}
//               />
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VocabularyListSidebar;
