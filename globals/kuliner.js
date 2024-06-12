document.addEventListener("DOMContentLoaded", () => {
  const packageForm = document.getElementById("package-form-kuliner");
  const packageList = document.getElementById("package-list-kuliner");
  let editingPackageId = null;

  // Ambil data dari server
  async function fetchPackages() {
    try {
      const response = await fetch("http://localhost:3000/kuliners");
      const kuliners = await response.json();
      packageList.innerHTML = "";
      kuliners.forEach((pkg) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${pkg.name}</td>
            <td>${pkg.description}</td>
            <td><iframe src="${pkg.location}" width="600" height="250" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></td>
            <td>${pkg.rating}</td>
            <td>${pkg.price}</td>
            <td><img src="${pkg.image}" alt="${pkg.image}" width="100"></td>
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
      ? `http://localhost:3000/kuliners/${editingPackageId}`
      : "http://localhost:3000/kuliners";

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
      const response = await fetch(`http://localhost:3000/kuliners/${id}`);
      const pkg = await response.json();
      document.getElementById("name").value = pkg.name;
      document.getElementById("description").value = pkg.description;
      document.getElementById("location").value = pkg.location;
      document.getElementById("rating").value = pkg.rating;
      document.getElementById("price").value = pkg.price;

      if (pkg.image.startsWith("http")) {
        document.getElementById("image").value = "";
      } else {
        document.getElementById("image").value = pkg.image;
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
        const response = await fetch(`http://localhost:3000/kuliners/${id}`, {
          method: "DELETE",
        });
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
