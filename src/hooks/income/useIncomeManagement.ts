
import { useState } from "react";
import { useIncomeData } from "./useIncomeData";
import { useIncomeOperations } from "./useIncomeOperations";
import { useIncomeDialogs } from "./useIncomeDialogs";
import { Income } from "@/services/database/models/income";

export const useIncomeManagement = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const { envelopes, isLoading, refreshIncomes } = useIncomeData();
  
  const { 
    handleAddIncome, 
    handleEditIncome, 
    handleDeleteIncome 
  } = useIncomeOperations(refreshIncomes);
  
  const {
    editDialogOpen,
    setEditDialogOpen,
    selectedIncome,
    setSelectedIncome,
    handleIncomeClick
  } = useIncomeDialogs();

  return {
    envelopes,
    addDialogOpen,
    setAddDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    selectedIncome,
    setSelectedIncome,
    handleAddIncome,
    handleEditIncome,
    handleDeleteIncome,
    handleIncomeClick,
    isLoading
  };
};
