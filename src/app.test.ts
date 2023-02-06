import { server, ErrnoException } from './app'
import { config } from './config'

const mockExit = jest.spyOn(process, 'exit')
    .mockImplementation((number: number | undefined) => { throw new Error('process.exit: ' + number); });
const mockClose = jest.spyOn(server, 'close')
    .mockImplementation((callback) => {
        if (callback) callback()
        return server
    })
const mockConsoleError = jest.spyOn(console, 'error')
    .mockImplementation(() => ({}))
const mockConsoleInfo = jest.spyOn(console, 'info')
    .mockImplementation(() => ({}))

describe('server', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    afterAll(async () => {
        mockClose.mockRestore()
        server.close()
    })

    it('is listening', () => {
        expect.assertions(1)
        expect(server.listening).toBe(true)
    })

    it('fires onListening', () => {
        expect.assertions(1)
        server.emit('listening')
        expect(mockConsoleInfo).toHaveBeenCalledWith(`Listening on port ${config.port}`)
    })

    it('processes a non-fatal error and stays alive', () => {
        expect.assertions(1)
        try {
            const err = new Error('hello world') as ErrnoException
            err.syscall = 'not listening'
            server.emit('error', err)
        } catch (e) {
            expect(server.listening).toBe(true)
        }
    })

    it('processes a lack of privileges: EACCES', () => {
        expect.assertions(2)
        try {
            const err = new Error('EACCES') as ErrnoException
            err.code = 'EACCES'
            err.syscall = 'listen'
            server.emit('error', err)
        } catch (e) {
            expect(mockExit).toHaveBeenCalled()
            expect(mockConsoleError).toHaveBeenCalledWith(`Port ${config.port} requires elevated privileges`)
        }
    })

    it('processes a lack of privileges: EADDRINUSE', () => {
        expect.assertions(2)
        try {
            const err = new Error('EADDRINUSE') as ErrnoException
            err.code = 'EADDRINUSE'
            err.syscall = 'listen'
            server.emit('error', err)
        } catch (e) {
            expect(mockExit).toHaveBeenCalled()
            expect(mockConsoleError).toHaveBeenCalledWith(`Port ${config.port} is already in use`)
        }
    })

    it('processes a random error by throwing it', () => {
        expect.assertions(2)
        const err = new Error('RANDOMERROR') as ErrnoException
        err.code = 'RANDOMERROR'
        err.syscall = 'listen'
        server.emit('error', err)
        expect(mockExit).not.toHaveBeenCalled()
        expect(mockConsoleError).toHaveBeenCalledWith(err)
    })

    // https://github.com/facebook/jest/issues/10374
    describe.skip('untestable, for now', () => {
        it('processes SIGINT and shuts down', async () => {
            expect.assertions(5)
            expect(server.listening).toEqual(true)
            try {
                process.emit('SIGINT')
            } catch (e) {} finally {
                expect(mockConsoleError).toHaveBeenCalledWith('SIGINT')
                expect(mockConsoleInfo).toHaveBeenCalledWith('Starting graceful shutdown')
                expect(mockConsoleInfo).toHaveBeenCalledWith('Graceful shutdown complete')
            }
        })
    
        // https://github.com/facebook/jest/issues/10374
        it('processes SIGTERM and shuts down', async () => {
            expect.assertions(3)
            try {
                process.emit('SIGTERM')
            } catch (e) {
                expect(mockConsoleError).toHaveBeenCalledWith('SIGTERM')
                expect(mockConsoleInfo).toHaveBeenCalledWith('Starting graceful shutdown')
                expect(mockConsoleInfo).toHaveBeenCalledWith('Graceful shutdown complete')
            }
        })
    })
})
