import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Chip,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { productApi } from "../../Api/ProductApi";
import { AuthContext } from "./AuthContext";
import ProductDetails from "./ProductDetails";
import ProductForm from "./ProductForm";

const STOCK_FAIBLE = 10;

export default function Products() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [erreur, setErreur] = useState(null);
  const [searchCategorie, setSearchCategorie] = useState("");
  const [prixMax, setPrixMax] = useState("");
  const [stockFaible, setStockFaible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [productDetail, setProductDetail] = useState({});

  useEffect(() => {
    productApi
      .getAll()
      .then((data) => setProducts(data))
      .catch((err) => setErreur(err.message));
  }, []);

  const hasRole = (role) => {
    if (!user || !user.role) return false;
    const roles = Array.isArray(user.role) ? user.role : [user.role];
    return roles.some(
      (r) =>
        typeof r === "string" &&
        (r.toUpperCase() === role.toUpperCase() ||
          r.toUpperCase() === `ROLE_${role.toUpperCase()}`),
    );
  };

  const canModify = hasRole("ADMIN") || hasRole("MANAGER");
  const canDelete = hasRole("ADMIN");

  const handleDetail = (id) => {
    productApi
      .getById(id)
      .then((data) => {
        setProductDetail(data);
        setShowDetail(true);
      })
      .catch((err) => setErreur(err.message));
  };

  const handleDelete = (id) => {
    if (!window.confirm("voulez vous supprimer ce produit")) {
      return;
    }
    productApi
      .delete(id)
      .then(() =>
        setProducts((prevProducts) =>
          prevProducts.filter((p) => p.id !== id),
        ),
      )
      .catch((err) => setErreur(err.message));
  };

  const handleSave = (data) => {
    if (editingProduct) {
      productApi
        .update(editingProduct.id, data)
        .then((updated) => {
          setProducts((prevProducts) =>
            prevProducts.map((p) => (p.id === updated.id ? updated : p)),
          );
          setShowForm(false);
          setEditingProduct(null);
        })
        .catch((err) => setErreur(err.message));
    } else {
      productApi
        .create(data)
        .then((created) => {
          setProducts((prevProducts) => [...prevProducts, created]);
          setShowForm(false);
        })
        .catch((err) => setErreur(err.message));
    }
  };

  const getStock = (p) => Number(p.quantiteStock ?? p.stock ?? 0);

  const filteredProducts = (products || []).filter((p) => {
    const matchCategorie = p.categorie
      ? p.categorie.toLowerCase().includes(searchCategorie.toLowerCase())
      : true;
    const prix = Number(p.prix);
    const matchPrix =
      prixMax === "" || isNaN(Number(prixMax))
        ? true
        : prix <= Number(prixMax);
    const matchStock = stockFaible ? getStock(p) <= STOCK_FAIBLE : true;
    return matchCategorie && matchPrix && matchStock;
  });

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f7f9fb", p: 3 }}>
      <Box
        sx={{
          maxWidth: 1440,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: "#191c1e" }}>
              Produits
            </Typography>
            <Typography variant="body2" sx={{ color: "#434655" }}>
              Consultez, ajoutez, modifiez et supprimez vos produits.
            </Typography>
          </Box>
          {canModify && (
            <Button
              variant="contained"
              onClick={() => {
                setEditingProduct(null);
                setShowForm(true);
              }}
              sx={{
                bgcolor: "#004ac6",
                "&:hover": { bgcolor: "#003ea8" },
                textTransform: "none",
                borderRadius: 2,
              }}
            >
              + Ajouter un produit
            </Button>
          )}
        </Box>

        {erreur && <Alert severity="error">{erreur}</Alert>}

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
          }}
        >
          <TextField
            placeholder="Rechercher par catégorie..."
            value={searchCategorie}
            onChange={(e) => setSearchCategorie(e.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
          />
          <TextField
            placeholder="Prix max (DH)"
            type="number"
            value={prixMax}
            onChange={(e) => setPrixMax(e.target.value)}
            size="small"
            sx={{ width: 150 }}
          />
          <Button
            variant={stockFaible ? "contained" : "outlined"}
            color="error"
            onClick={() => setStockFaible((prev) => !prev)}
            size="small"
            sx={{ textTransform: "none", height: 40 }}
          >
            {stockFaible ? "Afficher tout le stock" : "Stock faible"}
          </Button>
          <Chip
            label={`Total: ${filteredProducts.length}`}
            sx={{ fontWeight: "bold", bgcolor: "#e0e3e5", color: "#191c1e" }}
          />
        </Box>

        {/* Tableau */}
        <TableContainer
          component={Paper}
          sx={{
            border: "1px solid",
            borderColor: "#c3c6d7",
            borderRadius: 2,
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead sx={{ bgcolor: "#f2f4f6" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: "#434655" }}>
                  ID
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#434655" }}>
                  Nom
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#434655" }}>
                  Catégorie
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: "bold", color: "#434655" }}
                >
                  Prix (DH)
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#434655" }}>
                  Stock
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: "bold", color: "#434655" }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell sx={{ fontFamily: "monospace" }}>
                      #{p.id}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "medium", color: "#191c1e" }}>
                      {p.nom}
                    </TableCell>
                    <TableCell sx={{ color: "#434655" }}>
                      {p.categorie}
                    </TableCell>
                    <TableCell align="right" sx={{ color: "#191c1e" }}>
                      {p.prix}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <span>{getStock(p)}</span>
                        {getStock(p) <= STOCK_FAIBLE && (
                          <Chip label="Stock faible" size="small" color="error" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 1,
                        }}
                      >
                        <Button
                          size="small"
                          onClick={() => handleDetail(p.id)}
                          sx={{
                            color: "#004ac6",
                            textTransform: "none",
                          }}
                        >
                          Voir
                        </Button>
                        {canModify && (
                          <Button
                            size="small"
                            onClick={() => {
                              setEditingProduct(p);
                              setShowForm(true);
                            }}
                            sx={{
                              color: "#d97706",
                              textTransform: "none",
                            }}
                          >
                            Modifier
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleDelete(p.id)}
                            sx={{ textTransform: "none" }}
                          >
                            Supprimer
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{ py: 6, color: "#737686" }}
                  >
                    Aucun produit trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <ProductDetails
          open={showDetail}
          product={productDetail}
          onClose={() => setShowDetail(false)}
        />

        <ProductForm
          open={showForm}
          product={editingProduct}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          onSave={handleSave}
        />
      </Box>
    </Box>
  );
}
