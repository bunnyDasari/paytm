const { Router } = require("express");
const { PrismaClient } = require('@prisma/client');
const jwt = require("jsonwebtoken");
const { middleware } = require("./middleware");
const userRoute = Router();

const secKey = "fsafffdf"
const prisma = new PrismaClient()

userRoute.post("/signup", async (req, res) => {
    const { username, password } = req.body
    const userCheck = await prisma.users.findFirst({
        where: {
            username: username
        }
    })
    if (userCheck) {
        res.json({ msg: "user already exsist" })
    } else {
        await prisma.users.create({
            data: {
                username: username, password: password
            }
        })
        res.json({ msg: "user created" })
    }
})

userRoute.post("/login", async (req, res) => {
    const { username, password } = req.body

    const userCheck = await prisma.users.findFirst({
        where: {
            username
        }
    })
    if (userCheck) {
        const token = jwt.sign({
            token: userCheck.Id
        }, secKey)
        res.json({ token, username })
    } else {
        res.json({ msg: "signupp" })
    }

})

userRoute.post("/bank", middleware, async (req, res) => {
    const user = req.headers.token
    const { bankBalance } = req.body
    const userId = jwt.verify(user, secKey)
    console.log(userId)
    if (user) {
        await prisma.bank.create({
            data: {
                userId: userId.token,
                bankBalance: bankBalance
            }
        })
    }
    res.json({ msg: "user enterd" })
})

userRoute.post("/add_amount", middleware, async (req, res) => {
    const usertoken = req.headers.token
    const { addmoney } = req.body
    const user = jwt.verify(usertoken, secKey)
    const userFound = await prisma.bank.findFirst({
        where: {
            userId: user.token
        }
    })
    console.log(userFound)
    if (userFound) {
        await prisma.bank.update({
            where: {
                userId: user.token
            },
            data: {
                bankBalance: userFound.bankBalance + Number(addmoney)
            }
        })
        res.json({ msg: "amount added successfully..." })
    } else {
        await prisma.bank.create({
            data: {
                userId: user.token,
                bankBalance: addmoney
            }
        })
        res.json({ msg: "user amount added" })
    }
})

userRoute.put("/update-passowrd", async (req, res) => {
    const { username, newpass } = req.body
    const usercheck = await prisma.users.findFirst({
        where: {
            username
        }
    })
    if (usercheck) {
        await prisma.users.update({
            where: {
                Id: usercheck.Id
            },
            data: {
                password: newpass
            }
        })
        res.json({ msg: 'password updated' })
    } else {
        res.json({ msg: "user not found" })
    }
})
userRoute.post("/send-money", middleware, async (req, res) => {
    try {
        const token = req.headers.token
        const user = jwt.verify(token, secKey)
        const { senderid, sendmoney } = req.body

        // Validate input
        if (!senderid || !sendmoney || sendmoney <= 0) {
            return res.status(400).json({ msg: "Invalid input parameters" })
        }

        const checkBal = await prisma.bank.findFirst({
            where: {
                userId: user.token
            }
        })

        const reciverBal = await prisma.bank.findFirst({
            where: {
                userId: senderid
            }
        })

        if (!checkBal || !reciverBal) {
            return res.status(404).json({ msg: "User account not found" })
        }

        if (checkBal.bankBalance < sendmoney) {
            return res.status(400).json({ msg: "Insufficient balance" })
        }

        await prisma.$transaction(async (tx) => {
            // Update sender's balance
            await tx.bank.update({
                where: {
                    userId: user.token
                },
                data: {
                    bankBalance: checkBal.bankBalance - Number(sendmoney)
                }
            })

            // Update receiver's balance
            await tx.bank.update({
                where: {
                    userId: senderid
                },
                data: {
                    bankBalance: reciverBal.bankBalance + Number(sendmoney)
                }
            })
        })

        res.json({
            msg: "Money sent successfully",
            from: user.token,
            to: senderid,
            amount: sendmoney
        })
    } catch (error) {
        console.error("Transaction error:", error)
        res.status(500).json({
            msg: "Transaction failed",
            error: error.message
        })
    }
})

userRoute.get("/check-balance", middleware, async (req, res) => {
    const userId = req.headers.token
    const user = jwt.verify(userId, secKey)
    const checkBal = await prisma.bank.findFirst({
        where: {
            userId: user.token
        }
    })
    if (checkBal) {
        res.json({ Bal: checkBal.bankBalance })
    } else {
        await prisma.bank.create({
            data: {
                userId: user.token,
                bankBalance: parseInt("600000")
            }
        })
    }

})


userRoute.get("/get-users", middleware, async (req, res) => {
    const userlist = await prisma.users.findMany({})
    res.json({ userlist })
})

module.exports = { userRoute }