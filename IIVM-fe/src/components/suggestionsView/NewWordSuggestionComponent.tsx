// import React, { useState } from "react";
// import { NewWordSuggestion } from "../../interfaces/suggestion";
// import { Button } from "../UI/Button";
// import { ThumbsUp, Check, Info, X } from "lucide-react"; // Import the X icon for rejection
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "../../redux/store";
// import {
//   likeNewWordSuggestion,
//   approveNewWordSuggestion,
//   rejectSuggestion, // Import the reject action
// } from "../../redux/vocabulary/suggestionThunk";
// import { Toast } from "../UI/Toast";

// interface NewWordSuggestionItemProps {
//   suggestion: NewWordSuggestion;
//   onShowModal: (
//     content: string,
//     event: React.MouseEvent<HTMLButtonElement>
//   ) => void;
//   onLike: (id: number) => void;
//   onApprove?: (id: number) => void;
//   onReject?: (id: number) => void; // Add onReject prop
//   isMobile: boolean;
// }

// export const NewWordSuggestionItem: React.FC<NewWordSuggestionItemProps> = ({
//   suggestion,
//   onShowModal,
//   onLike,
//   onApprove,
//   onReject,
//   isMobile,
// }) => {
//   const commonClasses = "px-3 py-2 border-b last:border-b-0";

//   // Determine if the suggestion is in a "rejected" state
//   const isRejected = suggestion.status === "rejected";

//   // Define the approve button as a variable
//   const approveButton =
//     onApprove && suggestion.status === "pending" ? ( // Allow approval only if the status is pending
//       <Button
//         onClick={() => onApprove(suggestion.id)}
//         className="bg-green-500 hover:bg-green-600 text-white flex items-center"
//       >
//         <Check size={12} className="mr-1" />
//         Approve
//       </Button>
//     ) : null;

//   // Define the reject button as a variable
//   const rejectButton =
//     onReject && suggestion.status === "pending" ? ( // Allow rejection only if the status is pending
//       <Button
//         onClick={() => onReject(suggestion.id)} // Add reject functionality
//         className="bg-red-500 hover:bg-red-600 text-white ml-2 flex items-center" // Add margin-left for spacing
//       >
//         <X size={12} className="mr-1" />
//         Reject
//       </Button>
//     ) : null;

//   if (isMobile) {
//     return (
//       <li className={commonClasses}>
//         <div className="font-semibold text-purple-600">{suggestion.term}</div>
//         <div className="text-sm text-gray-600 mt-1">
//           <strong>Translation:</strong> {suggestion.translation}
//         </div>
//         <div className="text-sm text-gray-600 mt-1">
//           {" "}
//           {/* Category on new line */}
//           <strong>Category:</strong> {suggestion.category}
//         </div>
//         <div className="flex items-center mt-2 text-sm">
//           <strong className="mr-2">Definition:</strong>
//           {suggestion.definition ? (
//             <Button
//               onClick={(e) => onShowModal(suggestion.definition, e!)}
//               className="bg-gray-200 text-gray-600 p-1 rounded mr-4 h-6 w-6 flex items-center justify-center"
//             >
//               <Info size={12} />
//             </Button>
//           ) : (
//             <span className="text-gray-500 mr-4">N/A</span>
//           )}
//         </div>
//         <div className="flex items-center mt-2">
//           {" "}
//           {/* Status */}
//           <strong className="mr-2">Status:</strong>
//           <span
//             className={`px-2 py-1 rounded mr-4 ${
//               suggestion.status === "accepted"
//                 ? "bg-green-200 text-green-800"
//                 : suggestion.status === "pending"
//                 ? "bg-yellow-200 text-yellow-800"
//                 : "bg-red-200 text-red-800"
//             }`}
//           >
//             {suggestion.status}
//           </span>
//           <Button
//             onClick={() => onLike(suggestion.id)}
//             className="flex items-center justify-center bg-purple-100 text-purple-600 px-2 py-1 rounded h-6"
//             disabled={isRejected || suggestion.status === "accepted"} // Disable if rejected or accepted
//           >
//             <ThumbsUp size={12} className="mr-1" />
//             <span>{suggestion.like_count}</span>
//           </Button>
//         </div>
//         <div className="flex mt-2">
//           {" "}
//           {/* Flex container for buttons */}
//           {approveButton} {/* Render approve button */}
//           {rejectButton} {/* Render reject button */}
//         </div>
//       </li>
//     );
//   }

//   return (
//     <li className="border-b last:border-b-0">
//       <div
//         className={`py-2 px-3 grid grid-cols-12 gap-2 items-center ${
//           isRejected || suggestion.status === "accepted" ? "opacity-50" : ""
//         }`}
//       >
//         <div className="col-span-2 overflow-x-auto">{suggestion.term}</div>
//         <div className="col-span-1">
//           <Button
//             onClick={() => onLike(suggestion.id)}
//             className="flex items-center"
//             disabled={isRejected || suggestion.status === "accepted"} // Disable if rejected or accepted
//           >
//             <ThumbsUp size={12} className="mr-4 " />
//             <span>{suggestion.like_count}</span>
//           </Button>
//         </div>
//         <div className="col-span-2">
//           {suggestion.definition ? (
//             <Button
//               onClick={(e) => onShowModal(suggestion.definition, e!)}
//               className=""
//             >
//               <Info size={14} />
//             </Button>
//           ) : (
//             "N/A"
//           )}
//         </div>
//         <div className="col-span-2 text-gray-600  overflow-x-auto">{suggestion.translation}</div>
//         <div className="col-span-2 text-gray-600 mt-1">
//           {suggestion.category}
//         </div>{" "}
//         {/* Ensure category starts on new line */}
//         <div className="col-span-1">
//           <span
//             className={`px-2 py-1 rounded-full text-xs ${
//               suggestion.status === "accepted"
//                 ? "bg-green-200 text-green-800"
//                 : suggestion.status === "pending"
//                 ? "bg-yellow-200 text-yellow-800"
//                 : "bg-red-200 text-red-800"
//             }`}
//           >
//             {suggestion.status}
//           </span>
//         </div>
//         <div className="col-span-2 flex">
//           {" "}
//           {/* Flex container for buttons */}
//           {approveButton} {/* Render approve button */}
//           {rejectButton} {/* Render reject button */}
//         </div>
//       </div>
//     </li>
//   );
// };

// interface NewWordSuggestionsComponentProps {
//   newWordSuggestions: NewWordSuggestion[];
//   canApprove: boolean;
//   onShowModal: (
//     content: string,
//     event: React.MouseEvent<HTMLButtonElement>
//   ) => void;
//   isMobile: boolean;
// }

// export const NewWordSuggestionsComponent: React.FC<
//   NewWordSuggestionsComponentProps
// > = ({ newWordSuggestions, canApprove, onShowModal, isMobile }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const [toast, setToast] = useState<{
//     message: string;
//     type: "success" | "error";
//   } | null>(null);

//   const handleLikeNew = (suggestionId: number) => {
//     dispatch(likeNewWordSuggestion(suggestionId));
//   };

//   const handleApproveNew = async (suggestionId: number) => {
//     try {
//       await dispatch(approveNewWordSuggestion(suggestionId)).unwrap();
//       setToast({
//         message: "New word suggestion approved successfully!",
//         type: "success",
//       });
//     } catch (error) {
//       console.error(error);
//       setToast({
//         message: "Failed to approve new word suggestion. Please try again.",
//         type: "error",
//       });
//     }
//   };
//   const handleRejectNew = async (suggestionId: number) => {
//     try {
//       await dispatch(
//         rejectSuggestion({ suggestionId, suggestionType: "new_word" })
//       ).unwrap();
//       setToast({
//         message: "New word suggestion rejected successfully!",
//         type: "success",
//       });
//     } catch (error) {
//       console.error(error);
//       setToast({
//         message: "Failed to reject new word suggestion. Please try again.",
//         type: "error",
//       });
//     }
//   };

//   return (
//     <div className="border rounded-md overflow-hidden">
//       <h2 className="text-base font-bold px-3 py-2 bg-gray-200">
//         New Word Suggestions
//       </h2>
//       {!isMobile && (
//         <div className="bg-gray-100 text-gray-700 font-semibold py-2 px-3 grid grid-cols-12 gap-2">
//           <div className="col-span-2">Term</div>
//           <div className="col-span-1">Likes</div>
//           <div className="col-span-2">Definition</div>
//           <div className="col-span-2">Translation</div>
//           <div className="col-span-2">Category</div>
//           <div className="col-span-1">Status</div>
//           {canApprove && <div className="col-span-2"></div>}
//         </div>
//       )}
//       <div className="flex-grow overflow-y-auto">
//         <ul>
//           {newWordSuggestions.map((suggestion) => (
//             <NewWordSuggestionItem
//               key={suggestion.id}
//               suggestion={suggestion}
//               onShowModal={onShowModal}
//               onLike={handleLikeNew}
//               onApprove={canApprove ? handleApproveNew : undefined}
//               onReject={canApprove ? handleRejectNew : undefined} // Pass the reject handler
//               isMobile={isMobile}
//             />
//           ))}
//         </ul>
//       </div>
//       {toast && (
//         <Toast
//           message={toast.message}
//           type={toast.type}
//           onClose={() => setToast(null)}
//         />
//       )}
//     </div>
//   );
// };
