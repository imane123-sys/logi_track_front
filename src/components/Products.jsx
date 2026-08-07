//Docker a ajouter , Swagger Backend
import { useState, useEffect, useContext } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Chip,
  Box,
  Typography,
} from "@mui/material";
import { productApi } from "../../Api/ProductApi";
import { AuthContext } from "./AuthContext";
import ProductDetails from "./ProductDetails";
import ProductForm from "./ProductForm";

const STOCK_FAIBLE = 10;

export default function Products() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [categorySearch, setCategorySearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  const [detailsProduct, setDetailsProduct] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productApi.getAll();
      setProducts(data || []);
    } catch (err) {
      setError(err?.message || "Impossible de charger les produits.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
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

  const filteredProducts = (products || []).filter((p) => {
    if (!p) return false;

    const matchCategory = p.categorie
      ? p.categorie.toLowerCase().includes(categorySearch.toLowerCase())
      : true;

    const price = p.prix !== undefined && p.prix !== null ? Number(p.prix) : 0;
    const matchMaxPrice =
      maxPrice === "" || isNaN(Number(maxPrice))
        ? true
        : price <= Number(maxPrice);

    const stock =
      p.stock !== undefined && p.stock !== null
        ? Number(p.stock)
        : p.quantiteStock !== undefined && p.quantiteStock !== null
          ? Number(p.quantiteStock)
          : 0;
    const matchLowStock = onlyLowStock ? stock <= STOCK_FAIBLE : true;

    return matchCategory && matchMaxPrice && matchLowStock;
  });

  const handleSave = async (data) => {
    try {
      if (editingProduct) {
        await productApi.update(editingProduct.id, data);
      } else {
        await productApi.create(data);
      }
      setFormOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      setError(err?.message || "Impossible d'enregistrer le produit.");
    }
  };

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer "${product.nom}" ?`,
    );
    if (!confirmed) return;
    try {
      await productApi.delete(product.id);
      fetchProducts();
    } catch (err) {
      setError(err?.message || "Impossible de supprimer le produit.");
    }
  };

  const openAdd = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  return (
    <Box
      sx={{
        maxWidth: 1100,
        mx: "auto",
        p: 3,
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
          borderBottom: 1,
          borderColor: "divider",
          pb: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Gestion des Produits
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Consultez, ajoutez, modifiez et supprimez vos produits.
          </Typography>
        </Box>
        {canModify && (
          <Button
            variant="contained"
            onClick={openAdd}
            sx={{
              bgcolor: "#4f46e5",
              "&:hover": { bgcolor: "#4338ca" },
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            + Nouveau Produit
          </Button>
        )}
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            flexGrow: 1,
          }}
        >
          <TextField
            placeholder="Rechercher par catégorie..."
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            size="small"
            sx={{ minWidth: 200 }}
          />
          <TextField
            placeholder="Prix max (DH)"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            size="small"
            sx={{ width: 150 }}
          />
          <Button
            variant={onlyLowStock ? "contained" : "outlined"}
            color={onlyLowStock ? "error" : "primary"}
            onClick={() => setOnlyLowStock((prev) => !prev)}
            size="small"
            sx={{ textTransform: "none", height: 40 }}
          >
            {onlyLowStock ? "Afficher tout le stock" : "Stock faible"}
          </Button>
        </Box>
        <Chip
          label={`Total: ${filteredProducts.length}`}
          sx={{ fontWeight: "bold", bgcolor: "#f3f4f6", color: "#4b5563" }}
        />
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} variant="outlined">
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: "#f9fafb" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: "#374151" }}>
                  ID
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#374151" }}>
                  Nom
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#374151" }}>
                  Catégorie
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: "bold", color: "#374151" }}
                >
                  Prix (DH)
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#374151" }}>
                  Stock
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: "bold", color: "#374151" }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => {
                  const stockVal =
                    p.stock !== undefined && p.stock !== null
                      ? Number(p.stock)
                      : p.quantiteStock !== undefined &&
                          p.quantiteStock !== null
                        ? Number(p.quantiteStock)
                        : 0;
                  return (
                    <TableRow key={p.id} hover>
                      <TableCell sx={{ fontFamily: "monospace" }}>
                        #{p.id}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "medium" }}>
                        {p.nom}
                      </TableCell>
                      <TableCell>{p.categorie}</TableCell>
                      <TableCell align="right">{p.prix}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <span
                            style={{
                              minWidth: "30px",
                              display: "inline-block",
                            }}
                          >
                            {stockVal}
                          </span>
                          {stockVal <= STOCK_FAIBLE && (
                            <Chip
                              label="Stock faible"
                              size="small"
                              color="error"
                            />
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
                            onClick={() => setDetailsProduct(p)}
                            sx={{
                              color: "#4f46e5",
                              "&:hover": { bgcolor: "#f5f3ff" },
                              textTransform: "none",
                            }}
                          >
                            Voir
                          </Button>
                          {canModify && (
                            <Button
                              size="small"
                              onClick={() => openEdit(p)}
                              sx={{
                                color: "#d97706",
                                "&:hover": { bgcolor: "#fef3c7" },
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
                              onClick={() => handleDelete(p)}
                              sx={{
                                "&:hover": { bgcolor: "#fef2f2" },
                                textTransform: "none",
                              }}
                            >
                              Supprimer
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{ py: 6, color: "text.disabled" }}
                  >
                    Aucun produit trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <ProductDetails
        open={!!detailsProduct}
        product={detailsProduct}
        onClose={() => setDetailsProduct(null)}
      />

      <ProductForm
        open={formOpen}
        product={editingProduct}
        onClose={() => {
          setFormOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSave}
      />
    </Box>
  );
}
