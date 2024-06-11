document.addEventListener("DOMContentLoaded", () => {
  const packageForm = document.getElementById("package-form");
  const packageList = document.getElementById("package-list");
  let editingPackageId = null;

  // Ambil data dari server
  async function fetchPackages() {
    try {
      const response = await fetch("http://localhost:3000/destinations");
      const destinations = await response.json();
      packageList.innerHTML = "";
      destinations.forEach((pkg) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${pkg.name}</td>
          <td>${pkg.description}</td>
          <td>${pkg.location}</td>
          <td>${pkg.rating}</td>
          <td>${pkg.price}</td>
          <td><img src="${pkg.image_url}" alt="${pkg.image_url}" width="100"></td>
          <td class="action">
            <button class="edit" onclick="editPackage(${pkg.id})">Edit</button>
            <button class="delete" onclick="deletePackage(${pkg.id})">Delete</button>
          </td>
        `;
        packageList.appendChild(row);
      });
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  }

  // Tambahkan atau update data
  packageForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(packageForm);
    const method = editingPackageId ? "PUT" : "POST";
    const url = editingPackageId
      ? `http://localhost:3000/destinations/${editingPackageId}`
      : "http://localhost:3000/destinations";

    try {
      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      packageForm.reset();
      editingPackageId = null;
      fetchPackages();
    } catch (error) {
      console.error("Error adding/updating package:", error);
    }
  });

  // Edit package
  window.editPackage = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/destinations/${id}`);
      const pkg = await response.json();
      document.getElementById("name").value = pkg.name;
      document.getElementById("description").value = pkg.description;
      document.getElementById("location").value = pkg.location;
      document.getElementById("rating").value = pkg.rating;
      document.getElementById("price").value = pkg.price;

      if (pkg.image_url.startsWith("http")) {
        document.getElementById("image_url").value = "";
      } else {
        document.getElementById("image_url").value = pkg.image_url;
      }
      editingPackageId = id;
    } catch (error) {
      console.error("Error editing package:", error);
    }
  };

  // Hapus package
  window.deletePackage = async (id) => {
    const isConfirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus destinasi ini?"
    );
    if (isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:3000/destinations/${id}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        fetchPackages();
      } catch (error) {
        console.error("Error deleting package:", error);
      }
    }
  };

  fetchPackages();
});
