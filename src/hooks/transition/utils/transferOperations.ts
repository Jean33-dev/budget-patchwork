
import { toast } from "@/components/ui/use-toast";
import { MultiTransfer } from "@/types/transition";
import { db } from "@/services/database";
import { updateBudgetCarriedOver, updateBudgetSpent } from "./budgetUpdater";

/**
 * Transfère un montant d'un budget à un autre
 */
export const transferBudget = async (sourceId: string, targetId: string, amount: number, dashboardId: string) => {
  try {
    console.log(`[LOG] 🔄 transferBudget - Transfert depuis ${sourceId} vers ${targetId}, montant: ${amount}`);
    
    const budgets = await db.getBudgets();
    
    // S'assurer que les budgets appartiennent au dashboard actuel
    const source = budgets.find(b => b.id === sourceId && String(b.dashboardId || '') === String(dashboardId || ''));
    const target = budgets.find(b => b.id === targetId && String(b.dashboardId || '') === String(dashboardId || ''));
    
    if (!source || !target) {
      console.log(`[LOG] ❌ transferBudget - Budgets source ou cible introuvables ou n'appartiennent pas au dashboard ${dashboardId}`);
      
      if (!source) {
        console.log(`[LOG] ❌ transferBudget - Budget source ${sourceId} non trouvé`);
      }
      
      if (!target) {
        console.log(`[LOG] ❌ transferBudget - Budget cible ${targetId} non trouvé`);
      }
      
      throw new Error("Budgets source ou cible introuvables ou n'appartiennent pas au dashboard spécifié.");
    }
    
    console.log(`[LOG] 🔄 transferBudget - Source: ${source.title}, Cible: ${target.title}`);
    console.log(`[LOG] 🔄 transferBudget - Montant à transférer: ${amount}`);
    
    // 1. Mettre à jour la source : réinitialiser spent et carriedOver
    await updateBudgetSpent(sourceId, 0);
    await updateBudgetCarriedOver(sourceId, 0);
    console.log(`[LOG] ✅ transferBudget - Source ${source.title} réinitialisée (spent=0, carriedOver=0)`);
    
    // 2. Mettre à jour la cible : ajouter le montant au carriedOver existant
    const targetCurrentCarriedOver = target.carriedOver || 0;
    const targetNewCarriedOver = targetCurrentCarriedOver + amount;
    
    console.log(`[LOG] 🔄 transferBudget - Cible ${target.title}: carriedOver actuel=${targetCurrentCarriedOver}, nouveau=${targetNewCarriedOver}`);
    await updateBudgetCarriedOver(targetId, targetNewCarriedOver);
    
    // Vérification finale
    const updatedTarget = await db.getBudgets()
      .then(budgets => budgets.find(b => b.id === targetId));
    
    if (updatedTarget) {
      console.log(`[LOG] ✅ transferBudget - Vérification après transfert: carriedOver de ${target.title} = ${updatedTarget.carriedOver}`);
      if (updatedTarget.carriedOver !== targetNewCarriedOver) {
        console.log(`[LOG] ⚠️ transferBudget - ATTENTION: Le transfert semble ne pas avoir été correctement appliqué! Attendu: ${targetNewCarriedOver}, Obtenu: ${updatedTarget.carriedOver}`);
      } else {
        console.log(`[LOG] ✅ transferBudget - Transfert réussi de ${source.title} vers ${target.title}`);
      }
    }
  } catch (error) {
    console.error(`[LOG] ❌ transferBudget - Erreur lors du transfert:`, error);
    throw error;
  }
};

/**
 * Traite les transferts multiples depuis un budget vers plusieurs cibles
 */
export const processMultiTransfers = async (
  sourceId: string,
  transfers: MultiTransfer[],
  totalAmount: number,
  dashboardId: string
) => {
  try {
    console.log(`[LOG] 🔄 processMultiTransfers - Transferts multiples depuis ${sourceId}, montant total: ${totalAmount}`);
    
    if (!transfers || transfers.length === 0) {
      console.log(`[LOG] ⚠️ processMultiTransfers - Aucun transfert à effectuer`);
      return;
    }

    const budgets = await db.getBudgets();
    const source = budgets.find(b => b.id === sourceId);
    
    if (!source) {
      console.log(`[LOG] ❌ processMultiTransfers - Budget source ${sourceId} non trouvé`);
      throw new Error(`Budget source non trouvé: ${sourceId}`);
    }
    
    console.log(`[LOG] 🔄 processMultiTransfers - Source: ${source.title}`);
    console.log(`[LOG] 🔄 processMultiTransfers - Nombre de transferts: ${transfers.length}`);
    
    // Valider les pourcentages ou montants
    let isValidDistribution = true;
    const transferDetails = transfers.map(transfer => {
      const targetBudget = budgets.find(b => b.id === transfer.targetId);
      const targetTitle = targetBudget ? targetBudget.title : "Budget inconnu";
      
      if (!targetBudget) {
        console.log(`[LOG] ⚠️ processMultiTransfers - Budget cible ${transfer.targetId} non trouvé`);
        isValidDistribution = false;
      }
      
      return {
        targetId: transfer.targetId,
        targetTitle,
        amount: transfer.amount,
        exists: !!targetBudget
      };
    });
    
    if (!isValidDistribution) {
      console.log(`[LOG] ❌ processMultiTransfers - Distribution invalide: certains budgets cibles n'existent pas`);
      throw new Error("Certains budgets cibles n'existent pas");
    }
    
    // Calculer la somme totale à transférer
    const sumOfTransfers = transfers.reduce((sum, t) => sum + t.amount, 0);
    console.log(`[LOG] 🧮 processMultiTransfers - Somme des transferts: ${sumOfTransfers}`);
    
    // Vérifier si la somme dépasse le montant disponible
    if (sumOfTransfers > totalAmount) {
      console.log(`[LOG] ⚠️ processMultiTransfers - La somme des transferts (${sumOfTransfers}) dépasse le montant disponible (${totalAmount})`);
      // On peut décider de proportionner ou d'échouer
      // Ici on va proportionner
      const ratio = totalAmount / sumOfTransfers;
      console.log(`[LOG] 🧮 processMultiTransfers - Calcul du ratio d'ajustement: ${totalAmount} / ${sumOfTransfers} = ${ratio}`);
      
      transfers = transfers.map(t => ({
        ...t,
        amount: t.amount * ratio
      }));
      console.log(`[LOG] 🧮 processMultiTransfers - Ajustement des montants avec ratio ${ratio}`);
    }
    
    // Effectuer les transferts un par un
    for (const transfer of transfers) {
      const targetBudget = budgets.find(b => b.id === transfer.targetId);
      if (!targetBudget) continue; // Déjà vérifié plus haut
      
      console.log(`[LOG] 🔄 processMultiTransfers - Traitement du transfert vers ${targetBudget.title}: ${transfer.amount}`);
      
      // Ajouter le montant au carriedOver de la cible
      const targetCurrentCarriedOver = targetBudget.carriedOver || 0;
      const targetNewCarriedOver = targetCurrentCarriedOver + transfer.amount;
      
      console.log(`[LOG] 🔄 processMultiTransfers - Mise à jour de ${targetBudget.title}: carriedOver ${targetCurrentCarriedOver} -> ${targetNewCarriedOver}`);
      await updateBudgetCarriedOver(transfer.targetId, targetNewCarriedOver);
    }
    
    // Réinitialiser la source après tous les transferts
    console.log(`[LOG] 🔄 processMultiTransfers - Réinitialisation de la source ${source.title}`);
    await updateBudgetSpent(sourceId, 0);
    await updateBudgetCarriedOver(sourceId, 0);
    
    console.log(`[LOG] ✅ processMultiTransfers - Transferts multiples terminés depuis ${source.title}`);
    
    // Vérification finale
    const updatedBudgets = await db.getBudgets();
    console.log(`[LOG] 📊 processMultiTransfers - Vérification finale des budgets après transferts multiples:`);
    
    // Vérifier la source
    const updatedSource = updatedBudgets.find(b => b.id === sourceId);
    if (updatedSource) {
      console.log(`[LOG] 📊 Source ${updatedSource.title}: spent=${updatedSource.spent}, carriedOver=${updatedSource.carriedOver || 0}`);
    }
    
    // Vérifier chaque cible
    for (const transfer of transfers) {
      const updatedTarget = updatedBudgets.find(b => b.id === transfer.targetId);
      if (updatedTarget) {
        console.log(`[LOG] 📊 Cible ${updatedTarget.title}: carriedOver=${updatedTarget.carriedOver || 0}`);
      }
    }
  } catch (error) {
    console.error(`[LOG] ❌ processMultiTransfers - Erreur lors des transferts multiples:`, error);
    throw error;
  }
};
