class Product {
  constructor(name, isDomestic, price, weight = "N/A", description) {
    this.name = name
    this.isDomestic = isDomestic
    this.price = price
    this.weight = weight
    this.description = description
  }

  getTruncatedDescription() {
    if (this.description.lenght <= 10) {
      return this.description
    } else {
      return this.description.slice(0, 10) + "..."
    }
  }
}

class ProductGroup {
  constructor(name, products = []) {
    this.name = name
    this.products = products
  }

  addProduct(product) {
    this.products.push(product)
  }

  getSortedProducts() {
    return this.products.sort((a, b) => a.name.localeCompare(b.name))
  }

  getTotalCost() {
    let totalCost = 0
    for (let product of this.products) {
        totalCost += product.price
    }
    return totalCost
  }

  getProductCount() {
    let productCount = 0
    for (let product of this.products) {
        productCount += 1
    }
    return productCount
  }
}

class Receipt {
  constructor(products = []) {
    this.products = products
  }

  addProduct(product) {
    this.products.push(product)
  }

  getDomesticProducts() {
    return this.products.filter((product) => product.isDomestic)
  }

  getImportedProducts() {
    return this.products.filter((product) => !product.isDomestic)
  }

  getProductGroups() {
    const importedProducts = this.getImportedProducts()
    const domesticProducts = this.getDomesticProducts()

    const groups = [
      new ProductGroup("Domestic", domesticProducts),
      new ProductGroup("Imported", importedProducts),
    ]

    return groups
  }
}

async function getReceiptData() {
  const response = await fetch(
    "https://interview-task-api.mca.dev/qr-scanner-codes/alpha-qr-gFpwhsQ8fkY1"
  )
  const data = response.json()

  return data
}

async function main() {
  try {
    const receiptData = await getReceiptData()
    const productsData = receiptData
    const receipt = new Receipt()

    for (let productData of productsData) {
      let product = new Product(
        productData.name,
        productData.domestic,
        productData.price,
        productData.weight,
        productData.description
      )
      receipt.addProduct(product)
    }

    const productGroups = receipt.getProductGroups()

    for (let group of productGroups) {
      console.log("." + group.name)
      const sortedProducts = group.getSortedProducts()
      for (let product of sortedProducts) {
        console.log("..." + product.name)
        console.log("   " + "Price: $" + product.price.toFixed(1))
        console.log("   " + product.getTruncatedDescription())
        if (typeof product.weight === "string") {
          console.log("   " + "Weight: " + product.weight)
        } else {
          console.log("   " + "Weight: " + product.weight + "g")
        }
      }
    }
    for (let group of productGroups){
        console.log(group.name + " cost: $" + group.getTotalCost().toFixed(1))
    }
    for (let group of productGroups){
        console.log(group.name + " count: " + group.getProductCount())
    }

  } catch (error) {
    console.error(error)
  }
}

main()
