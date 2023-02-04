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
        expect(server.listening).toBe(true)
    })

    it('fires onListening', () => {
        server.emit('listening')
        expect(mockConsoleInfo).toHaveBeenCalledWith(`Listening on port ${config.port}`)
    })

    it('processes a non-fatal error and stays alive', () => {
        try {
            const err = new Error('hello world') as ErrnoException
            err.syscall = 'not listening'
            server.emit('error', err)
        } catch (e) {
            expect(server.listening).toBe(true)
        }
    })

    it('processes a lack of privileges: EACCES', () => {
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
        const err = new Error('RANDOMERROR') as ErrnoException
        err.code = 'RANDOMERROR'
        err.syscall = 'listen'
        server.emit('error', err)
        expect(mockExit).not.toHaveBeenCalled()
        expect(mockConsoleError).toHaveBeenCalledWith(err)
    })

    it('processes SIGINT and shuts down', async () => {
        try {
            process.emit('SIGINT')
        } catch (e) {
            expect(mockConsoleError).toHaveBeenCalledWith('SIGINT')
            expect(mockConsoleInfo).toHaveBeenCalledWith('Starting graceful shutdown')
            expect(mockConsoleInfo).toHaveBeenCalledWith('Graceful shutdown complete')
        }
    })

    it('processes SIGTERM and shuts down', async () => {
        try {
            process.emit('SIGTERM')
        } catch (e) {
            expect(mockConsoleError).toHaveBeenCalledWith('SIGTERM')
            expect(mockConsoleInfo).toHaveBeenCalledWith('Starting graceful shutdown')
            expect(mockConsoleInfo).toHaveBeenCalledWith('Graceful shutdown complete')
        }
    })
})
