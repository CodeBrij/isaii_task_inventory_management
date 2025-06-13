import { useEffect } from "react";
import { useInventoryStore } from "../stores/useInventoryStore.js";
import DeleteModal from "./DeleteModal";
import UpdateProductModal from "./UpdateProductModal";
import AddProductModal from "./AddProductModal.jsx";
import AddUserModal from "./AddUserModal.jsx";
import { FiTrash2, FiEdit, FiLogOut, FiDownload } from "react-icons/fi";
import toast from "react-hot-toast";
import { axiosInstance } from "../axios.js";
import { useNavigate } from "react-router";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function HomePage() {
  const {
    filteredProducts = [],
    searchQuery,
    setProducts,
    setSearch,
    openModal,
    modals,
    user,
    setUser
  } = useInventoryStore();

  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/api/auth/check").then((res) => {
      if (res.data) setUser(res.data);
    });
    // seedProducts()
  }, [setUser]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("/api/product/get/all");
        if (res.data?.data) {
          setProducts(res.data.data);
        } else {
          toast.warn("No data received from API");
          setProducts([]);
        }
      } catch (error) {
        toast.error("Error fetching products");
        setProducts([]);
      }
    };

    fetchProducts();
  }, [setProducts]);

  const seedProducts = async () => {
    const sampleProducts = [
      {
        sku: "ELEC001",
        name: "Wireless Mouse",
        category: "Electronics",
        quantity: 25,
        lowStockThreshold: 10,
      },
      {
        sku: "APP001",
        name: "Denim Jacket",
        category: "Apparel",
        quantity: 15,
        lowStockThreshold: 5,
      },
      {
        sku: "STAT001",
        name: "Notebook Set",
        category: "Stationery",
        quantity: 50,
        lowStockThreshold: 20,
      },
      {
        sku: "FURN001",
        name: "Office Chair",
        category: "Furniture",
        quantity: 5,
        lowStockThreshold: 3,
      },
      {
        sku: "ACC001",
        name: "Laptop Sleeve",
        category: "Accessories",
        quantity: 30,
        lowStockThreshold: 10,
      },
      {
        sku: "ELEC002",
        name: "Bluetooth Speaker",
        category: "Electronics",
        quantity: 12,
        lowStockThreshold: 5,
      },
      {
        sku: "STAT002",
        name: "Pen Set",
        category: "Stationery",
        quantity: 100,
        lowStockThreshold: 30,
      },
    ];

    try {
      for (const product of sampleProducts) {
        await axiosInstance.post("/api/product/addProduct", product);
      }
      toast.success("Sample products inserted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to insert sample products.");
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
      navigate("/");
      toast.success("Logout successful");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDownloadExcel = () => {
    if (filteredProducts.length === 0) {
      toast.error("No products to export.");
      return;
    }

    const data = filteredProducts.map((prod) => ({
      SKU: prod.sku,
      Name: prod.name,
      Category: prod.category,
      Quantity: prod.quantity,
      "Low Stock Threshold": prod.lowStockThreshold,
      "Created At": new Date(prod.createdAt).toLocaleString(),
      "Updated At": prod.updatedAt ? new Date(prod.updatedAt).toLocaleString() : "-"
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream"
    });

    saveAs(blob, "product-report.xlsx");
    toast.success("Excel downloaded");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4">
        <h1 className="text-2xl font-bold mb-5">
         Isaii.AI MERN Stack Intern Task
          </h1>
      {/* Top Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Search */}
        <input
          type="text"
          placeholder="Search products…"
          className="flex-1 min-w-[200px] p-2 border rounded focus:outline-blue-400"
          value={searchQuery}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Download Button */}
        <button
          onClick={handleDownloadExcel}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          <FiDownload /> Download Report
        </button>

        {/* Add Product */}
        <button
          onClick={() => openModal("add", true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Add Product
        </button>

        {/* Add User (admin only) */}
        {user?.role === "admin" && (
          <button
            onClick={() => openModal("addUser", true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Add User
          </button>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          <FiLogOut /> Logout
        </button>
      </div>

      {/* Product Table */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left">SKU</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Qty</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
  {filteredProducts.length > 0 ? (
    [...filteredProducts]
      .sort((a, b) => {
        const aLow = a.quantity < a.lowStockThreshold;
        const bLow = b.quantity < b.lowStockThreshold;
        return aLow === bLow ? 0 : aLow ? -1 : 1;
      })
      .map((prod) => {
        const isLow = prod.quantity < prod.lowStockThreshold;
        const isAdmin = user?.role === "admin";

        return (
          <tr
            key={prod._id}
            className={`border-b hover:bg-slate-50 ${isLow ? "bg-red-100" : ""}`}
          >
            <td className="p-3">{prod.sku}</td>
            <td className="p-3">{prod.name}</td>
            <td className="p-3">{prod.category}</td>
            <td className="p-3">{prod.quantity}</td>
            <td className="p-3 space-x-2">
              <button
                onClick={() => isAdmin && openModal("update", prod._id)}
                className={`${
                  !isAdmin ? "cursor-not-allowed opacity-50" : ""
                }`}
                disabled={!isAdmin}
              >
                <FiEdit
                  className={`inline ${
                    isAdmin
                      ? "text-blue-600 hover:text-blue-800"
                      : "text-gray-400"
                  }`}
                />
              </button>
              <button
                onClick={() => isAdmin && openModal("delete", prod._id)}
                className={`${
                  !isAdmin ? "cursor-not-allowed opacity-50" : ""
                }`}
                disabled={!isAdmin}
              >
                <FiTrash2
                  className={`inline ${
                    isAdmin
                      ? "text-red-600 hover:text-red-800"
                      : "text-gray-400"
                  }`}
                />
              </button>
            </td>
          </tr>
        );
      })
  ) : (
    <tr>
      <td colSpan="5" className="text-center p-4 text-slate-500">
        No products found.
      </td>
    </tr>
  )}
</tbody>


        </table>
      </div>

      {/* Modals */}
      {modals.delete && <DeleteModal productId={modals.delete} />}
      {modals.update && <UpdateProductModal productId={modals.update} />}
      {modals.add && <AddProductModal />}
      {modals.addUser && <AddUserModal />}
    </div>
  );
}
